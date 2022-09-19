const puppeteer = require('puppeteer');

module.exports = {
    LBF_1_5: async function (obj) {
        let { server_name, tracking_number, badge_id, dir, headless } = obj;
        // Test Case Object
        let test_case = {
            application: "Logbook",
            test_category: "Logbook Functionality",
            test_description: "Load Deparments",
            test_case: "Confirm color coding is correct for each department",
            step: "LBF-1.5",
            step_description: "1.Enter serial number 2. Click on load machine",
            dependencies: "Tasks and Exceptions to be present for a work center",
            role: "User",
            navigation: "Browse the logbook application URL ->Enter Serial Number->Click on load machine",
            result: "PENDING",
            reason: null,
            expected_results: "Green, yellow, red should be reflected as  per current status of each department.",
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
            // 1. Enter serial number 
            await page.waitForSelector('[data-component-path="C$0:0$0:0.0:1"]');
            await page.type('[data-component-path="C$0:0$0:0.0:1"]', tracking_number);
            // 2. Click on load machine 
            await page.waitForSelector('[data-component-path="C$0:0$0:0.0:2"]');
            await page.click('[data-component-path="C$0:0$0:0.0:2"]');

            // Logic Test
            await page.waitForTimeout(1000);
            let case_1 = await page.evaluate(async () => {
                // Get Tracking Number from LeftContent => machine-info
                return await document.querySelectorAll('[data-component-path="C$0:0$0:3:0.0:1"]')[0].children.length;
            });
            // Validate 
            if (case_1 > 0) {
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

    },
}