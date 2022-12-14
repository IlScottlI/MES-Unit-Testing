const puppeteer = require('puppeteer');

module.exports = {
    LBF_1_13: async function (obj) {
        let { server_name, tracking_number, badge_id, dir, headless } = obj;
        // Test Case Object
        let test_case = {
            application: "Logbook",
            test_category: "Logbook Functionality",
            test_description: "Photo gallery",
            test_case: "Verify the photos for the selected workCenter",
            step: "LBF-1.13",
            step_description: "1.Enter serial number 2.click on load machine 3.click on any department 4. click on workCenter  5.click on Gallery button.",
            dependencies: "Active serial number",
            role: "User",
            navigation: "Browse the logbook application URL ->Enter Serial Number->Click on load machine->Click on any deparment-> Click on WorkCenter ->Click on Gallery button.",
            result: "PENDING",
            reason: null,
            expected_results: "Error message displays indicating 'No Photos found for the selected WorkCenter'",
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
            await page.waitForTimeout(1000);
            await page.waitForSelector('[data-component-path="C$0:0$0:0.0:2"]');
            await page.click('[data-component-path="C$0:0$0:0.0:2"]');
            // 3. Click on any department 
            await page.waitForTimeout(1000);
            await page.waitForSelector('[data-component-path="C$0:0$0:3:0$0:1[1].0"]');
            await page.click('[data-component-path="C$0:0$0:3:0$0:1[1].0"]');
            // 4. Click on a workcenter 
            await page.waitForTimeout(1000);
            await page.waitForSelector('[data-component-path="C$0:0$0:3:0$0:3[0].0"]');
            await page.click('[data-component-path="C$0:0$0:3:0$0:3[0].0"]');
            // 5. Click on Gallery button.
            await page.waitForTimeout(1000);
            await page.waitForSelector('[data-component-path="C$0:0$0:0.0:4"]');
            await page.click('[data-component-path="C$0:0$0:0.0:4"]');

            // Logic Test
            await page.waitForTimeout(1000);
            let case_1 = await page.evaluate(async () => {
                return await document.querySelectorAll('[data-component-path="PPopUp1.0:0:1"] span')[0].textContent;
            });
            // Validate 
            if (case_1 == 'No Photos found for the selected WorkCenter') {
                // Capture Results
                test_case.result = "PASS";
            } else {
                test_case.result = "FAIL";
                test_case.reason = "Unable to find 'No Photos found for the selected WorkCenter' on the Photo Gallery popup"
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