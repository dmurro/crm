function App() {
  const sendEmail = async () => {
    try {
      const response = await fetch("https://crm-three-green.vercel.app/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "davi.murroni@gmail.com",
          subject: "Test email",
          html: "<h1>This is a test email</h1>",
        }),
      });

      if (response.ok) {
        alert("Email sent successfully");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send email");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="App">
      <h1>Send Email</h1>
      <button onClick={sendEmail}>Send Email</button>
    </div>
  );
}

export default App;
