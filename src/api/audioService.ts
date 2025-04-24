import { AudioCollection, AudioCollectionDetail } from '../dto/AudioDTO';

// Base API URL
const API_URL = 'https://cms.tosu-thien.com/api/content/tosuthien/audio-collections';
const FILTER_URL = `${API_URL}?$filter=data/category/iv eq`;



// Function to fetch audio collections by category ID and return id, name and audios
export const fetchAudioCategory = async (params: string | null): Promise<AudioCollection[]> => {
  console.log(`params ${params}`);
  
  try {
    // Construct URL with ternary operator for more concise code
    const url = `${FILTER_URL} ${params === null ? null : `'${params}'&$orderby=created asc`}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const data = await response.json();
    // Transform API data to include id, name, and audios
    if (data && data.items) {
      return data.items.map((item: any) => ({
        id: item.id,
        name: item.data.name.iv,
        isCategory: item.data.isCategory.iv,
        description: item.data.description.iv,
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching audio collections:', error);
    throw error;
  }
};

// Function to fetch a single audio collection by ID
export const fetchAudioById = async (id: string): Promise<AudioCollectionDetail | null> => {
  try {
    const url = `${API_URL}/${id}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    
    const item = await response.json();
    
    // Transform API data to include all details
    return {
      id: item.id,
      name: item.data.name.iv,
      audios: item.data.audios?.iv || [],
      isCategory: item.data.isCategory?.iv,
    };
  } catch (error) {
    console.error(`Error fetching audio collection with ID ${id}:`, error);
    return null;
  }
};

export default {
  fetchAudioCategory,
  fetchAudioById
};