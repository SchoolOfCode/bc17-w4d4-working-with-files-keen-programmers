import fs from "node:fs/promises"; // Import the file system module to read/write files
import { v4 as uuidv4 } from "uuid"; // Import UUID to generate unique IDs
const fileName = "quotes.json"; // File to store quotes

// below function is used to get the quotes from the file
export async function getQuotes() { // export means that the function can be imported and used in other files
    try { // Try to read the file
        const data = await fs.readFile(fileName, 'utf8'); // Read the file as a string in UTF-8 encoding
        return JSON.parse(data); // Parse the JSON data into an object which means converting a string into a JavaScript object
    } catch (error) {
        if (error.code === 'ENOENT') { // Handle case where file does not exist, ENOENT is a file not found error
            return []; // Return an empty array if the file does not exist
        } else {
            throw error;
        }
    }
}

// below function is used to add the quotes to the file
export async function addQuote(quoteText) { // quoteText is the text of the quote to add
    try {
        const newQuote = { // Create a new quote object with a unique ID
            id: uuidv4(),
            quoteText: quoteText
        };

        const quotes = await getQuotes(); // Get the existing quotes from the file
        console.log('Current Quotes:', quotes); // Console log the current quotes for debugging
        quotes.push(newQuote); // Push means add the new quote to the existing quotes

// The JSON.stringify() method converts a JavaScript object or value to a JSON string
// JSON.stringify(value[, replacer[, space]]) where 2 means the number of spaces to use for indentation
// Null replacer means no changes to the object
        await fs.writeFile(fileName, JSON.stringify(quotes, null, 2)); // Write the updated quotes back to the file
        console.log('Quote Added:', newQuote); // Console log the new quote for debugging
        return newQuote;   
    } catch (error) {
        console.error('Error adding quote:', error);
        throw error;
    }
}

// below function is used to get the random quote from the file
export async function getRandomQuote() { 
    const quotes = await getQuotes(); // await is used to wait for the promise to resolve which means to wait for the quotes to be read from the file
    if (quotes.length === 0) return null; // Handle case where there are no quotes
    // Math.floor() is used to round down to the nearest whole number and Math.random() generates a random number between 0 and 1. Quotes.length is the number of quotes in the array, so multiplying it by Math.random() gives a random index.
    const randomIndex = Math.floor(Math.random() * quotes.length); // Generate a random index to select a quote
    return quotes[randomIndex];
}

// 
export async function editQuote(id, quoteText) {
    const quotes = await getQuotes();
    const index = quotes.findIndex(quote => quote.id === id);

    if (index === -1) {
        return null;  // Quote not found
    }

    // Update the quote
    quotes[index].quoteText = quoteText;

    // Save updated quotes
    await fs.writeFile(fileName, JSON.stringify(quotes, null, 2));

    return quotes[index];
}

export async function deleteQuote(id) {
    const quotes = await getQuotes();
    const index = quotes.findIndex(quote => quote.id === id);

    if (index === -1) {
        return null;  // Quote not found
    }

    // Remove the quote
    const [deletedQuote] = quotes.splice(index, 1);

    // Save updated quotes
    await fs.writeFile(fileName, JSON.stringify(quotes, null, 2));

    return deletedQuote;
}

