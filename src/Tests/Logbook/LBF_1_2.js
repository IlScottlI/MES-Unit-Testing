const puppeteer = require('puppeteer');

module.exports = {
    LBF_1_2: async function (obj) {
        let { server_name, tracking_number, badge_id, dir, headless } = obj;
        // Test Case Object
        let test_case = {
            application: "Logbook",
            test_category: "Logbook Functionality",
            test_description: "Load Machine",
            test_case: "Load without entering serial number",
            step: "LBF-1.2",
            step_description: "1.Click on Load  machine or press Enter key without entering serial number",
            dependencies: "Active serial numbers",
            role: "User",
            navigation: "Browse the logbook application URL ->Click on load machine",
            result: "PENDING",
            reason: null,
            expected_results: "Error message displays indicating invalid serial number",
            tested_url: `https://${server_name}/data/perspective/client/Logbook`,
            start_time: Date.now(),
        };

        await puppeteer.launch({
            args: ['--start-maximized'],
            headless: headless,
            fullPage: true,
        }).then(async browser => {
            const page = await browser.newPage();
            await page.setViewport({ width: 1920, height: 1080 });
            // Set Screenshot Path
            test_case.screenshot_path = `${dir}/${test_case.application}/${test_case.step}-${tracking_number}.png`;
            // Start Test Case
            await page.goto(`https://${server_name}/data/perspective/client/Logbook`);
            // 1. Click on Load  machine or press Enter key without entering serial number 
            await page.waitForSelector('[data-component-path="C$0:0$0:0.0:2"]');
            await page.click('[data-component-path="C$0:0$0:0.0:2"]');

            // Logic Test
            await page.waitForTimeout(1000);
            let case_1 = await page.evaluate(async () => {
                // Get Tracking Number from LeftContent => machine-info
                return await document.querySelectorAll('[data-component-path="PserialNumbernotExist.0:0"] span')[0].textContent;
            });
            // Validate 
            if (case_1 == 'Please enter the Machine SN / Tracking Number') {
                // Capture Results
                test_case.result = "PASS";
            } else {
                test_case.result = "FAIL";
            }
            // Capture Screenshot
            await page.screenshot({ path: `./${dir}/${test_case.application}/${test_case.step}-${tracking_number}.png`, fullPage: true });

            // End Test Case
            await browser.close();
        });

        test_case.end_time = Date.now();
        return test_case;

    }
}