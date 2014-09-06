/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Question = require('../api/question/question.model');
var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');

Question.find({}).remove(function() {
  Question.create({
    description: '1 、机动车仪表板上（如图所示）亮表示什么？',
    images: ['/word/media/image1.jpeg'],
    choices: [{
      identifier: 'A',
      choice: '驻车制动解除'
    }, {
      identifier: 'A',
      choice: '制动踏板没回位'}, 
    {
      identifier: 'A',
      choice: '行车制动器失效'}, 
    {
      identifier: 'A',
      choice: '制动系统出现异常'
    }],
    answers: ['D'],
    tags: ['Driver', '2014'],
    active: false
  }, {
    description: '3 、下列哪种违法行为的机动车驾驶人将被一次记 12 分？',
    choices: [{
      identifier: 'A',
      choice: '驾驶故意污损号牌的机动车上道路行驶'
    }, {
      identifier: 'A',
      choice: '机动车驾驶证被暂扣期间驾驶机动车的'}, 
    {
      identifier: 'A',
      choice: '以隐瞒、欺骗手段补领机动车驾驶证的'}, 
    {
      identifier: 'A',
      choice: '驾驶机动车不按照规定避让校车的'
    }],
    answers: ['A'],
    tags: ['Driver', '2014']
  });
});

Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});