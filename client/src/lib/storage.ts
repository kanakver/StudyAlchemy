import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';
import { Transformation } from '@shared/schema';

// Initialize localforage
localforage.config({
  name: 'StudyTransform',
  storeName: 'transformations',
});

// Get all stored transformations
export async function getStoredTransformations(): Promise<Transformation[]> {
  try {
    const keys = await localforage.keys();
    const transformations: Transformation[] = [];

    for (const key of keys) {
      if (key.startsWith('transformation_')) {
        const transformation = await localforage.getItem<Transformation>(key);
        if (transformation) {
          transformations.push(transformation);
        }
      }
    }

    // Sort by creation date (newest first)
    return transformations.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } catch (error) {
    console.error('Error fetching stored transformations:', error);
    return [];
  }
}

// Save a transformation
export async function storeTransformation(transformation: Transformation): Promise<void> {
  try {
    const key = `transformation_${transformation.id}`;
    await localforage.setItem(key, transformation);
  } catch (error) {
    console.error('Error storing transformation:', error);
    throw new Error('Failed to save transformation');
  }
}

// Get a specific transformation
export async function getStoredTransformation(id: string): Promise<Transformation | null> {
  try {
    const key = `transformation_${id}`;
    return await localforage.getItem(key);
  } catch (error) {
    console.error('Error fetching transformation:', error);
    return null;
  }
}

// Delete a transformation
export async function deleteStoredTransformation(id: string): Promise<boolean> {
  try {
    const key = `transformation_${id}`;
    await localforage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error deleting transformation:', error);
    return false;
  }
}

// Save all transformations (useful for bulk operations)
export async function storeAllTransformations(transformations: Transformation[]): Promise<void> {
  try {
    for (const transformation of transformations) {
      await storeTransformation(transformation);
    }
  } catch (error) {
    console.error('Error storing all transformations:', error);
    throw new Error('Failed to save transformations');
  }
}

// Clear all stored transformations
export async function clearStoredTransformations(): Promise<void> {
  try {
    await localforage.clear();
  } catch (error) {
    console.error('Error clearing transformations:', error);
    throw new Error('Failed to clear transformations');
  }
}
