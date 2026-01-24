# cleanup-env.ps1
Write-Host "Repository corrente: $(Get-Location)" -ForegroundColor Cyan
Write-Host "ATTENZIONE: Questo script riscrivera la cronologia Git!" -ForegroundColor Yellow
Write-Host "Assicurati di aver fatto un backup del repository" -ForegroundColor Yellow
Write-Host ""

$confirmation = Read-Host "Continuare? (y/n)"
if ($confirmation -ne 'y') {
    Write-Host "Operazione annullata" -ForegroundColor Red
    exit
}

# Verifica Git
if (-not (Test-Path .git)) {
    Write-Host "Errore: Non sei nella root di un repository Git!" -ForegroundColor Red
    exit
}

# Backup del branch corrente
$currentBranch = git branch --show-current
Write-Host "Branch corrente: $currentBranch" -ForegroundColor Green

# Installa git-filter-repo se non presente
Write-Host "Verifico git-filter-repo..." -ForegroundColor Cyan
$filterRepoExists = $null
try {
    $filterRepoExists = Get-Command git-filter-repo -ErrorAction SilentlyContinue
} catch {
    $filterRepoExists = $null
}

if (-not $filterRepoExists) {
    Write-Host "Installazione git-filter-repo..." -ForegroundColor Yellow
    pip install git-filter-repo
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Errore installazione. Provo con pip3..." -ForegroundColor Yellow
        pip3 install git-filter-repo
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Errore installazione git-filter-repo" -ForegroundColor Red
            Write-Host "Prova manualmente: pip install git-filter-repo" -ForegroundColor Yellow
            exit
        }
    }
}

# Rimuovi .env dalla cronologia
Write-Host "Rimozione file .env dalla cronologia..." -ForegroundColor Cyan
git filter-repo --path-glob '.env*' --invert-paths --force

if ($LASTEXITCODE -ne 0) {
    Write-Host "Errore durante la rimozione" -ForegroundColor Red
    exit
}

# Pulizia
Write-Host "Pulizia repository..." -ForegroundColor Cyan
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Aggiorna .gitignore
Write-Host "Aggiornamento .gitignore..." -ForegroundColor Cyan
$gitignoreContent = @"

# Environment variables
.env
.env.*
.env.local
.env.*.local
!.env.example
"@

if (Test-Path .gitignore) {
    $currentGitignore = Get-Content .gitignore -Raw -ErrorAction SilentlyContinue
    if ($currentGitignore -notmatch '\.env') {
        Add-Content .gitignore $gitignoreContent
    }
} else {
    Set-Content .gitignore $gitignoreContent
}

git add .gitignore
git commit -m "Update .gitignore to exclude .env files" 2>$null

# Crea .env.example
if (-not (Test-Path .env.example)) {
    Write-Host "Creazione .env.example..." -ForegroundColor Cyan
    
    $envExample = @"
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password

# API Keys
API_KEY=your_api_key_here
SECRET_KEY=your_secret_key_here

# App Configuration
NODE_ENV=development
PORT=3000
"@
    
    Set-Content .env.example $envExample
    git add .env.example
    git commit -m "Add .env.example template"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Pulizia completata!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "PASSI SUCCESSIVI OBBLIGATORI:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Cambia TUTTE le credenziali che erano nel .env" -ForegroundColor Yellow
Write-Host "   - Database passwords"
Write-Host "   - API keys"
Write-Host "   - JWT secrets"
Write-Host ""
Write-Host "2. Esegui il force push:" -ForegroundColor Yellow
Write-Host "   git push origin --force --all"
Write-Host "   git push origin --force --tags"
Write-Host ""
Write-Host "3. Verifica che .env sia stato rimosso:" -ForegroundColor Yellow
Write-Host "   git log --all --full-history -- .env"
Write-Host ""