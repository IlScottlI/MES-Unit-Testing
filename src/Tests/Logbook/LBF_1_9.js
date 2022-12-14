const puppeteer = require('puppeteer');

module.exports = {
    LBF_1_9: async function (obj) {
        let { server_name, tracking_number, badge_id, dir, headless } = obj;
        // Test Case Object
        let test_case = {
            application: "Logbook",
            test_category: "Logbook Functionality",
            test_description: "Logbook Tasks",
            test_case: "Adding an exception",
            step: "LBF-1.9",
            step_description: "1.Enter serial number  2.Click on load machine  3.Click on any department  4. Click on workCenter 5.Click on the exception Dropdown ,choose the exception to be added (Shortage,Outstanding,Defects)  6. fill out the details for the exception",
            dependencies: "Atleast one Task should be present for a machine in the selected work center",
            role: "User",
            navigation: "Browse the logbook application URL ->Enter Serial Number->Click on load machine->Click on any deparment-> Click on WorkCenter ->Click on exception Dropdown ,choose the exception .",
            result: "PENDING",
            reason: null,
            expected_results: "The exception details should appear in the relevant section.",
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
            // 5. Click on the exception Dropdown ,choose the exception to be added (Shortage,Outstanding,Defects) 
            await page.waitForTimeout(1000);
            await page.waitForSelector('[data-component-path="C$0:0$0:3:1$0:1$0:0[view-cell-0-Exception].0:0"] #arrow_drop_down');
            await page.click('[data-component-path="C$0:0$0:3:1$0:1$0:0[view-cell-0-Exception].0:0"] #arrow_drop_down');
            await page.waitForTimeout(1000);
            await page.waitForSelector('[data-component-path="Pexception.0:0"]');
            await page.click('[data-component-path="Pexception.0:0"]');
            await page.waitForTimeout(1000);
            await page.type('[data-component-path="P38yar-TG.0:1"]', badge_id);
            await page.click('[data-component-path="P38yar-TG.0:2:0"]');
            await page.waitForTimeout(1000);
            await page.click('[data-component-path="Padd-shortage.0:0:4"]');
            await page.type('[data-component-path="Padd-shortage.0:0:4"]', String(Date.now()));
            await page.waitForTimeout(1000);
            await page.click('[data-component-path="Padd-shortage.0:0:5"]');
            await page.type('[data-component-path="Padd-shortage.0:0:5"]', String(10));
            await page.waitForTimeout(1000);
            await page.click('[data-component-path="Padd-shortage.0:0:7"]');
            await page.type('[data-component-path="Padd-shortage.0:0:7"]', badge_id + tracking_number);
            await page.waitForTimeout(1000);
            await page.click('[data-component-path="Padd-shortage.0:0:8"]');

            // Logic Test
            await page.waitForTimeout(1000);
            let case_1 = await page.evaluate(async () => {
                return await document.querySelectorAll('#popup-add-shortage').length;
            });
            // Validate 
            if (case_1 < 1) {
                // Capture Results
                test_case.result = "PASS";
            } else {
                test_case.result = "FAIL";
                test_case.reason = "Adding an exception task failed due to the modal not closing after the user clicked save.";
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