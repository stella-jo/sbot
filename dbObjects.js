const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "root", process.env.password, {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: "database.sqlite"
});

const Users = require("./models/Users.js")(sequelize, Sequelize.DataTypes);
const CurrencyShop = require("./models/CurrencyShop.js")(sequelize, Sequelize.DataTypes);
const UserItems = require("./models/UserItems.js")(sequelize, Sequelize.DataTypes);

UserItems.belongsTo(CurrencyShop, {foreignKey: "item_id", as: "item"});

Reflect.defineProperty(Users.prototype, "addItem", {
    value: async function addItem(item) {
        const userItem = await UserItems.findOne({
            where: {user_id: this.user_id, item_id: item.id}
        });

        if (userItem) {
            userItem.amount += 1;
            return userItem.save();
        }

        const data = {user_id: this.user_id, item_id: item.id, name: item.name, amount: 1};

        return UserItems.create(data);
    }

});

Reflect.defineProperty(Users.prototype, "deleteItem", {
    value: async function deleteItem(item) {
        if (item.amount > 1) {
            item.amount -= 1;
            return item.save();
        }

        return item.destroy({where: {user_id: this.user_id, item_id: item.id}})
    }
});

Reflect.defineProperty(Users.prototype, "getItems", {
	value: function getItems() {
		return UserItems.findAll({
			where: {user_id: this.user_id},
			include: ["item"]
		});
	}
});

module.exports = {Users, CurrencyShop, UserItems};