const Campaign = require("../models/campaigns");
const CampaignRecipient = require("../models/campaignRecipients");
const emailService = require("../routes/services/sendMail");

const EMAILS_PER_RUN = 380;
const MAX_EMAILS_PER_BATCH = 380;
const ONE_HOUR_MS = 60 * 60 * 1000;
const LOOP_INTERVAL_MS = 60 * 1000; // 1 minute

let sendLoopInterval = null;


/**
 * Process pending campaign recipients: send up to EMAILS_PER_RUN emails,
 * update recipient status and campaign stats. Marks campaign as 'sent' when no pending remain.
 */
async function runCampaignSendJob() {
  try {
    // Prendiamo campagne attive che:
    // - non sono ancora completate
    // - oppure hanno ancora pending
    const campaigns = await Campaign.find({
      status: "sending",
    })
      .populate("modelId")
      .lean();

    const now = Date.now();

    for (const campaign of campaigns) {
      // Se è stato già mandato un batch meno di 1h fa → skip
      if (
        campaign.lastBatchSentAt &&
        now - new Date(campaign.lastBatchSentAt).getTime() < ONE_HOUR_MS
      ) {
        continue;
      }

      // Prendiamo subito 380 pending
      const pending = await CampaignRecipient.find({
        campaignId: campaign._id,
        status: "pending",
      })
        .sort({ createdAt: 1 })
        .limit(MAX_EMAILS_PER_BATCH)
        .lean();

      if (pending.length === 0) {
        // Nessun pending → campagna completata
        await Campaign.updateOne(
          { _id: campaign._id },
          { $set: { status: "sent", sentAt: new Date() } }
        );
        continue;
      }

      for (const rec of pending) {
        if (!campaign.modelId?.htmlContent) {
          await CampaignRecipient.updateOne(
            { _id: rec._id },
            { $set: { status: "failed", error: "Campaign or template not found" } }
          );
          await Campaign.updateOne(
            { _id: campaign._id },
            {
              $inc: { "stats.failed": 1 },
              $push: {
                "stats.errors": {
                  recipient: rec.email,
                  error: "Campaign or template not found",
                },
              },
            }
          );
          continue;
        }

        try {
          await emailService.sendEmail({
            to: rec.email,
            subject: campaign.subject,
            html: campaign.modelId.htmlContent,
          });

          await CampaignRecipient.updateOne(
            { _id: rec._id },
            { $set: { status: "sent", sentAt: new Date(), error: null } }
          );

          await Campaign.updateOne(
            { _id: campaign._id },
            { $inc: { "stats.sent": 1 } }
          );
        } catch (err) {
          const errMsg = err.message || String(err);

          await CampaignRecipient.updateOne(
            { _id: rec._id },
            { $set: { status: "failed", error: errMsg } }
          );

          await Campaign.updateOne(
            { _id: campaign._id },
            {
              $inc: { "stats.failed": 1 },
              $push: {
                "stats.errors": {
                  recipient: rec.email,
                  error: errMsg,
                },
              },
            }
          );
        }
      }

      // Salviamo quando è stato inviato l’ultimo batch
      await Campaign.updateOne(
        { _id: campaign._id },
        { $set: { lastBatchSentAt: new Date() } }
      );
    }
  } catch (error) {
    console.error("Campaign send job error:", error);
  }
}

/**
 * Start the send loop only when the user triggers "Send" for a campaign.
 * Loop runs every minute and stops when there are no more pending recipients.
 */
function startSendLoopIfNeeded() {
  if (sendLoopInterval) return;

  sendLoopInterval = setInterval(async () => {
    await runCampaignSendJob();
    const pending = await CampaignRecipient.countDocuments({ status: "pending" });
    if (pending === 0) {
      clearInterval(sendLoopInterval);
      sendLoopInterval = null;
    }
  }, LOOP_INTERVAL_MS);
}

module.exports = { runCampaignSendJob, startSendLoopIfNeeded, EMAILS_PER_RUN, MAX_EMAILS_PER_BATCH };
