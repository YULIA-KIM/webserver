const Sequelize = require('sequelize'); //nodejs와 db를 이어주면서 간편하게 쿼리문을 작성할수있도록 지원해주는 도구?
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
        userID: Sequelize.STRING,
        password: Sequelize.STRING,
        admin: { type: Sequelize.BOOLEAN, default: false }
    }
);





module.exports = {
    sequelize: sequelize,
    Url: Url,
    User: User
};
