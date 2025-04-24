import { SimplifiedBookDTO } from '../dto/BookDTO';
const API_URL = 'https://cms.tosu-thien.com/api/content/tosuthien/books';


// Function to transform API response to only extract required fields
const transformToSimplifiedBook = (item: any): SimplifiedBookDTO => {
  return {
    id: item.id,
    title: item.data.title.iv,
    description: item.data.description.iv,
    firstChapterId: item.data.book.iv && item.data.book.iv.length > 0 ? item.data.book.iv[0] : null,
    isCollection: item.data.isCollection.iv
  };
};

// Function to fetch all books with optimized data
export const fetchBooks = async (): Promise<SimplifiedBookDTO[]> => {
  try {
    
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    // Transform API data to only include required fields
    const books = data.items
      .filter((item: any) => !item.data.isCollection.iv) // Chỉ lấy sách không phải collection
      .map((item: any) => transformToSimplifiedBook(item));
    
    return books;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export default {
  fetchBooks,
}; 