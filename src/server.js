
const fastify = require('fastify')({ logger: true });
const path = require('path');
const fs = require('fs');
const test_scripts = require('./Tests/cases');

fastify.register(require("@fastify/cors"), {
    origin: true
});

const getTestScripts = () => {
    let res = [];
    for (var prop in test_scripts) {
        let script = `${test_scripts[prop]}`;
        res.push({ prop, script });
    }
    return res;
}

const deleteData = (path) => {
    fs.rmdir(path, { recursive: true }, err => {
        if (err) {
            throw err
        }

        return (`${path} is deleted!`)
    })
}

const storeData = (data, path) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}

const loadData = (path) => {
    try {
        return fs.readFileSync(path, 'utf8')
    } catch (err) {
        console.error(err)
        return false
    }
}

// Declare a route
fastify.get('/', async (request, response) => {

    this.tracking_number = request.query.tracking_number;
    this.server_name = request.query.server_name;
    this.badge_id = request.query.badge_id;
    this.headless = Boolean(request.query.headless);
    this.tests_to_run = request.query.tests_to_run;

    if (!this.tracking_number) return 'Missing Tracking Number => EXAMPLE http://127.0.0.1:3000?headless=true&tracking_number=1363559&server_name=naaccscdatw08.oshkoshglobal.com&badge_id=297151';
    if (!this.server_name) return 'Missing Server Name => EXAMPLE http://127.0.0.1:3000?headless=true&tracking_number=1363559&server_name=naaccscdatw08.oshkoshglobal.com&badge_id=297151';
    if (!this.badge_id) return 'Missing Badge ID => EXAMPLE http://127.0.0.1:3000?headless=true&tracking_number=1363559&server_name=naaccscdatw08.oshkoshglobal.com&badge_id=297151';

    this.dir = './src/TEST_HISTORY/' + Date.now();
    if (!fs.existsSync(this.dir)) {
        fs.mkdirSync(this.dir);
    }

    fs.mkdirSync(`./${this.dir}/Logbook`);
    fs.mkdirSync(`./${this.dir}/Shortage`);
    fs.mkdirSync(`./${this.dir}/Outstanding`);
    fs.mkdirSync(`./${this.dir}/Defects`);
    fs.mkdirSync(`./${this.dir}/Hotsheet(logbook)`);
    fs.mkdirSync(`./${this.dir}/SWI`);
    fs.mkdirSync(`./${this.dir}/JSA`);
    fs.mkdirSync(`./${this.dir}/mQC`);
    fs.mkdirSync(`./${this.dir}/XAV`);
    fs.mkdirSync(`./${this.dir}/MEV`);

    this.test_results = [];
    // Logbook Functionality Tests
    if (!this.tests_to_run) {
        for (const prop in test_scripts) {
            const res = await test_scripts[prop](this);
            this.test_results.push(res);
        }
    } else {
        for (const i in this.tests_to_run.split(',')) {
            const res = await test_scripts[this.tests_to_run.split(',')[i]](this);
            this.test_results.push(res);
        }
    }

    this.end_time = Date.now();
    let { tracking_number, badge_id, end_time, test_results } = this;
    storeData({ statusCode: 200, tracking_number, badge_id, end_time, test_results }, `./${this.dir}/res.json`);
    response.send({ statusCode: 200, tracking_number, badge_id, end_time, test_results });
});

fastify.get('/del_history_item', (request, response) => {
    let id = request.query['id'];
    response.type('application/json');
    response.send(deleteData(`./src/TEST_HISTORY/${id}`));
});

fastify.get('/load_history', (request, response) => {
    let id = request.query['id'];
    response.type('application/json');
    response.send(loadData(`./src/TEST_HISTORY/${id}/res.json`));
});

fastify.get('/read_test_scripts', (request, response) => {
    let res = getTestScripts();
    response.type('application/json');
    response.send(res);
})

fastify.get('/read_history', (request, response) => {
    let res = [];
    const directoryPath = path.join(__dirname, 'TEST_HISTORY');
    //passsing directoryPath and callback function
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function (file) {
            if (!file) return;
            // Do whatever you want to do with the file
            let obj = JSON.parse(loadData(`./src/TEST_HISTORY/${file}/res.json`));
            obj.id = Number(file);
            obj.start_time = Number(file);
            res.push(obj);
        });
        response.type('application/json');
        response.send(res);
    });
})

// Run the server!
const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
start();


