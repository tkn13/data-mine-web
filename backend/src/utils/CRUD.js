const fs = require('fs/promises');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

const BASE_PATH = path.join(process.cwd(), 'database');

const getFilePath = async (fileName) => {
    const fullPath = path.join(BASE_PATH, fileName.endsWith('.csv') ? fileName : `${fileName}.csv`);
    try {
        await fs.mkdir(BASE_PATH, { recursive: true });
    } catch (err) { /* Directory exists */ }
    return fullPath;
};

const CRUD = {
    /**
     * INTERNAL: Overwrites the entire file. 
     * Used by update and delete to refresh the dataset.
     */
    _writeAll: async (fileName, data) => {
        const filePath = await getFilePath(fileName);
        const csvContent = stringify(data, { header: true });
        await fs.writeFile(filePath, csvContent);
        return { success: true, path: filePath };
    },

    /**
     * CREATE: Appends new data to the end of the file.
     */
    create: async (fileName, data) => {
        const filePath = await getFilePath(fileName);
        const records = Array.isArray(data) ? data : [data];
        
        let fileExists = false;
        try {
            await fs.access(filePath);
            fileExists = true;
        } catch {
            fileExists = false;
        }

        // Only add headers if the file is brand new
        const csvContent = stringify(records, { 
            header: !fileExists,
            columns: Object.keys(records[0])
        });

        await fs.appendFile(filePath, csvContent);
        return { success: true, path: filePath };
    },

    read: async (fileName) => {
        const filePath = await getFilePath(fileName);
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            return parse(fileContent, {
                columns: true,
                skip_empty_lines: true,
                cast: true // Automatically converts strings to numbers/booleans where applicable
            });
        } catch (error) {
            if (error.code === 'ENOENT') return [];
            throw error;
        }
    },

    /**
     * UPDATE: Reads all, modifies the specific record, and overwrites the file.
     */
    update: async (fileName, key, updatedRecord) => {
        let data = await CRUD.read(fileName);
        // Ensure comparison works by converting both to Strings
        const index = data.findIndex(item => String(item[key]) === String(updatedRecord[key]));

        if (index !== -1) {
            // Merge existing data with new updates
            data[index] = { ...data[index], ...updatedRecord };
            // Use _writeAll to overwrite the file with the modified array
            await CRUD._writeAll(fileName, data);
            return true;
        }
        return false;
    },

    delete: async (fileName, key, value) => {
        const data = await CRUD.read(fileName);
        const filteredData = data.filter(item => String(item[key]) !== String(value));
        
        if (data.length !== filteredData.length) {
            await CRUD._writeAll(fileName, filteredData);
            return true;
        }
        return false;
    }
};

module.exports = CRUD;