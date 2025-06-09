import prisma from "../config/config.js";
const db = prisma;

const countItemsByCategory = async (category) => {
    const count = await db.itemMaster.count({
        where: {
            category: category,
        },
    });
    return count;
};
const insertItem = async (item) => {
    const newItem = await db.itemMaster.create({ 
        data : {
            itemCode: item.itemCode,
            itemName: item.itemName,
            category: item.category,
            price: item.price,
            uom: item.uom,
            status: item.status,
        },
     });
    return newItem;
};

const getAllItems = async () => {
    const items = await db.itemMaster.findMany();
    return items;
};

const getItemById = async (id) => {
    const item = await db.itemMaster.findUnique({
        where: { id: id },
    });
    return item;
};

const updateItem = async (id, item) => {
    const updatedItem = await db.itemMaster.update({
        where: { id: id },
        data: {
            itemCode: item.itemCode,
            itemName: item.itemName,
            category: item.category,
            price: item.price,
            uom: item.uom,
            status: item.status,
        },
    });
    return updatedItem;
};

const deleteItem = async (id) => {
    const deletedItem = await db.itemMaster.delete({
        where: { id: id },
    });
    return deletedItem;
};

export { insertItem, countItemsByCategory, getAllItems, getItemById, updateItem, deleteItem };