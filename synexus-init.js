// synexus-init.js
const { execSync } = require('child_process');
const fs = require('fs');

console.log("🚀 Initializing Synexus Hackathon Workspace...");

try {
    // 1. Install dependencies and activate Husky Git Hooks
    console.log("📦 Installing packages and activating Git hooks...");
    execSync('npm install', { stdio: 'inherit' });

    // 2. Check if the VS Code extension is installed
    console.log("🛡️ Verifying Synexus Shield Extension...");
    const extensions = execSync('code --list-extensions').toString();
    
    if (!extensions.toLowerCase().includes('synexus-core.synexus-shield')) {
        console.log("\n❌ ERROR: Synexus Shield VS Code Extension is NOT installed.");
        console.log("Please install it from the extensions tab before coding!");
        process.exit(1);
    }

    // 3. Verify compulsory files exist
    const requiredFiles = ['test-config.json', '.cursorrules', '.secretlintrc.json'];
    for (const file of requiredFiles) {
        if (!fs.existsSync(file)) {
            console.log(`\n❌ ERROR: Missing compulsory file: ${file}`);
            console.log(`Run 'git checkout HEAD -- ${file}' to restore it.`);
            process.exit(1);
        }
    }

    console.log("\n✅ ALL SYSTEMS GO! Your workspace is secured and ready.");
} catch (error) {
    console.log("\n🚨 Setup failed. Please call an organizer for help.");
}