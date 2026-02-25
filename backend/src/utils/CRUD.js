const fs = require('fs/promises');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

// Define the base directory relative to the project root
const BASE_PATH = path.join(process.cwd(), 'database');

/**
 * Helper to get the full path and ensure the directory exists
 */
const getFilePath = async (fileName) => {
    const fullPath = path.join(BASE_PATH, fileName.endsWith('.csv') ? fileName : `${fileName}.csv`);
    
    // Ensure /database directory exists
    try {
        await fs.mkdir(BASE_PATH, { recursive: true });
    } catch (err) {
        // Directory already exists or couldn't be created
    }
    
    return fullPath;
};

const CRUD = {
    /**
     * CREATE: Append or overwrite data to a CSV file
     * @param {string} fileName - e.g., 'users'
     * @param {Array<Object>} data - Array of JSON objects
     */
    create: async (fileName, data) => {
        const filePath = await getFilePath(fileName);
        const csvContent = stringify([data], { header: false });
        await fs.appendFile(filePath, csvContent);
        return { success: true, path: filePath };
    },

    /**
     * READ: Get all data from a CSV file as JSON
     * @param {string} fileName 
     */
    read: async (fileName) => {
        const filePath = await getFilePath(fileName);
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            return parse(fileContent, {
                columns: true,
                skip_empty_lines: true
            });
        } catch (error) {
            if (error.code === 'ENOENT') return []; // Return empty if file doesn't exist
            throw error;
        }
    },

    /**
     * UPDATE: Find a record by a key and update its values
     * @param {string} fileName 
     * @param {string} key - The unique identifier field (e.g., 'id')
     * @param {Object} updatedRecord - The new data (must include the key)
     */
    update: async (fileName, key, updatedRecord) => {
        let data = await CRUD.read(fileName);
        const index = data.findIndex(item => item[key] === updatedRecord[key]);

        if (index !== -1) {
            data[index] = { ...data[index], ...updatedRecord };
            await CRUD.create(fileName, data);
            return true;
        }
        return false;
    },

    /**
     * DELETE: Remove a record by a key
     * @param {string} fileName 
     * @param {string} key 
     * @param {any} value - The value to match for deletion
     */
    delete: async (fileName, key, value) => {
        const data = await CRUD.read(fileName);
        const filteredData = data.filter(item => item[key] !== String(value));
        
        if (data.length !== filteredData.length) {
            await CRUD.create(fileName, filteredData);
            return true;
        }
        return false;
    }
};

module.exports = CRUD;