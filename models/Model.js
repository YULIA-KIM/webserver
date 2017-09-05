const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'pingpong', 'root', 'root',
    {
        'host': 'localhost', // 데이터베이스 호스트
        'dialect': 'mysql' // 사용할 데이터베이스 종류
    }
);

const Url = sequelize.define('url', {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        address: Sequelize.STRING,
        name: Sequelize.STRING,
        userId: Sequelize.STRING,
        feed: Sequelize.STRING,
        state: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    }
);

const User = sequelize.define('user', {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: Sequelize.STRING,
        password: Sequelize.STRING,
        admin: { type: Sequelize.BOOLEAN, default: false }
    }
);

const Feed = sequelize.define('feed', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    urlId: Sequelize.INTEGER,
    title: Sequelize.STRING,
    content: {
        type: Sequelize.TEXT
    },
    image: Sequelize.STRING,
    link: Sequelize.STRING
});

module.exports = {
    sequelize: sequelize,
    Url: Url,
    User: User,
    Feed: Feed
};
