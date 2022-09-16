const puppeteer = require('puppeteer');

module.exports = {
    // Logbook Functionality Test Cases
    LBF_1_1: async function (obj) {
        let { server_name, tracking_number, badge_id, dir, headless } = obj;
        // Test Case Object
        let test_case = {
            application: "Logbook",
            test_category: "Logbook Functionality",
            test_description: "Load Machine",
            test_case: "Enter Valid serial number ",
            step: "LBF-1.1",
            step_description: "1.Enter serial number (valid-enter) 2. Click on load machine or press Enter key",
            dependencies: "Active serial numbers",
            role: "User",
            navigation: "Browse the logbook application URL ->Enter Serial Number->Click on load machine",
            result: "PENDING",
            expected_results: "All data for the serial number is populated on the Logbook page",
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
            // Start => Logbook => Test Cases
            // Set Screenshot Path
            test_case.screenshot_path = `${dir}/${test_case.application}/${test_case.step}-${tracking_number}.png`;
            // Test Case => LBF-1.1
            await page.goto(`https://${server_name}/data/perspective/client/Logbook`);
            await page.waitForSelector('[data-component-path="C$0:0$0:0.0:1"]');
            // 1. Enter serial number (valid-enter) 
            await page.type('[data-component-path="C$0:0$0:0.0:1"]', tracking_number);
            // 2. Click on load machine or press Enter key
            await page.waitForTimeout(1000);
            await page.click('[data-component-path="C$0:0$0:0.0:2"]');
            // logic Test
            await page.waitForTimeout(1000);
            let case_1 = await page.evaluate(async () => {
                // Get Tracking Number from LeftContent => machine-info
                return await document.querySelectorAll('[data-component-path="C$0:0$0:1:0.0:6:1"] span')[0].textContent;
            });
            test_case.screenshot_path = `${dir}/${test_case.application}/${test_case.step}-${tracking_number}.png`;
            // Validate 
            if (case_1 == tracking_number) {
                // Capture Results
                test_case.result = "PASS";
            } else {
                // Capture Results
                test_case.result = "FAIL";
            }
            // Capture Screenshot
            await page.screenshot({ path: `./${dir}/${test_case.application}/${test_case.step}-${tracking_number}.png`, fullPage: true });

            // End Test Case => LBF-1.1
            await browser.close();
        });

        test_case.end_time = Date.now();
        return test_case;

    }
}