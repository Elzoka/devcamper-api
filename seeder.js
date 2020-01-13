const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');


// load env vars
dotenv.config({path: './config/config.env'});

// Load models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');
const Review = require('./models/Review');


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

const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));

const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8'));


// import into db
const importData = async () => {
    try{
        await Bootcamp.create(bootcamps);
        await Course.create(courses)
        .then(async () => {
            await Review.create(reviews);
        })
        await User.create(users);

        console.log('Data Imported...'.green.inverse);
    }catch(err){
        console.error(err);
    }
}

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        
        console.log('Data destroyed'.red.inverse);
    } catch (error) {
        console.error(error)
    }
}

const flag = process.argv[2];
let operation;
if(flag === '-i'){
    operation = importData();
}else if (flag === '-d') {
    operation = deleteData();
}else if (flag === '-r'){
    operation = deleteData()
        .then(() => {
            return importData();
        })
}

operation.then(() => {
    process.exit();
});
