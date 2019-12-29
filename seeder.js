const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');


// load env vars
dotenv.config({path: './config/config.env'});

// Load models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');


// connnect to db
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));

const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));


// import into db
const importData = async () => {
    try{
        await Bootcamp.create(bootcamps);
        await Course.create(courses);

        console.log('Data Imported...'.green.inverse);
        process.exit();
    }catch(err){
        console.error(err);
    }
}

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        
        console.log('Data destroyed'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(error)
    }
}

if(process.argv[2] === '-i'){
    importData();
}else if (process.argv[2] === '-d') {
    deleteData();
}