const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'pingpong', 'root', '1017',
    {
        'host': 'localhost', // 데이터베이스 호스트
        'dialect': 'mysql' // 사용할 데이터베이스 종류
    }
);

const Url = sequelize.define('url', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        address: Sequelize.STRING,
        name: Sequelize.STRING,
        userId: Sequelize.STRING,
        feed: Sequelize.STRING,
        state: Sequelize.INTEGER
    }
);

const User = sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userID: Sequelize.STRING,
        password: Sequelize.STRING
    }
);

module.exports = {
    sequelize: sequelize,
    Url: Url,
    User: User
};
