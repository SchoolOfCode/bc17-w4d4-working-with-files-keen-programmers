import fs from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";

const fileName = "quotes.json";

export async function getQuotes() {
    try {
        const data = await fs.readFile(fileName, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        } else {
            throw error;
        }
    }
}
export async function addQuote(quoteText) {
    try {
        const newQuote = {
            id: uuidv4(),
            quoteText: quoteText
        };

        const quotes = await getQuotes();
        console.log('Current Quotes:', quotes); // Debugging
        quotes.push(newQuote);

        await fs.writeFile(fileName, JSON.stringify(quotes, null, 2));
        console.log('Quote Added:', newQuote); // Debugging

        return newQuote;
    } catch (error) {
        console.error('Error adding quote:', error);
        throw error;
    }
}
// export async function addQuote(quoteText) {
//     const newQuote = {
//         id: uuidv4(),
//         quoteText
//     };

//     // Get existing quotes
//     const quotes = await getQuotes();

//     // Add the new quote
//     quotes.push(newQuote);

//     // Save updated quotes
//     await fs.writeFile(fileName, JSON.stringify(quotes, null, 2));

//     return newQuote;
// }

export async function getRandomQuote() {
    const quotes = await getQuotes();
    if (quotes.length === 0) return null;  // Handle case where there are no quotes
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

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
