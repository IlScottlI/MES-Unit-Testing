const puppeteer = require('puppeteer');

module.exports = {
    LBF_1_11: async function (obj) {
        let { server_name, tracking_number, badge_id, dir, headless } = obj;
        // Test Case Object
        let test_case = {
            application: "Logbook",
            test_category: "Logbook Functionality",
            test_description: "Logbook Tasks",
            test_case: "Clear filter",
            step: "LBF-1.11",
            step_description: "1.Enter serial number  2.Click on load machine  3.Click on any department  4. Click on workCenter 5. Click on Clear filter button ",
            dependencies: "Tasks should be in the filtered mode",
            role: "User",
            navigation: "Browse the logbook application URL ->Enter Serial Number->Click on load machine->Click on any deparment-> Click on WorkCenter ->Click on Clear filter button",
            result: "PENDING",
            expected_results: "Filters for all the Grid  will be cleared",
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
            // 5. Click on checkbox for the task to be filter.
            await page.waitForTimeout(1000);
            await page.waitForSelector('[data-component-path="C$0:0$0:3:1$0:1$0:0[view-cell-1-selection].0:0"]');
            await page.click('[data-component-path="C$0:0$0:3:1$0:1$0:0[view-cell-1-selection].0:0"]');
            // 6. Click on Clear filter button
            await page.waitForTimeout(1000);
            await page.waitForSelector('[data-component-path="C$0:0$0:3:1.0:0:5"]');
            await page.click('[data-component-path="C$0:0$0:3:1.0:0:5"]');


            // Logic Test
            await page.waitForTimeout(1000);
            let case_1 = await page.evaluate(async () => {
                return await document.querySelectorAll('[data-component-path="C$0:0$0:3:3.0:1"')[0].style.display;
            });
            // Validate 
            if (case_1 != 'none') {
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