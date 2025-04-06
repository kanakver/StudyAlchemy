import { type Transformation } from "@shared/schema";

export interface IStorage {
  getTransformations(): Promise<Transformation[]>;
  getTransformation(id: string): Promise<Transformation | undefined>;
  createTransformation(transformation: Transformation): Promise<Transformation>;
  updateTransformation(id: string, transformation: Partial<Transformation>): Promise<Transformation | undefined>;
  deleteTransformation(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private transformations: Map<string, Transformation>;

  constructor() {
    this.transformations = new Map();
  }

  async getTransformations(): Promise<Transformation[]> {
    return Array.from(this.transformations.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async getTransformation(id: string): Promise<Transformation | undefined> {
    return this.transformations.get(id);
  }

  async createTransformation(transformation: Transformation): Promise<Transformation> {
    this.transformations.set(transformation.id, transformation);
    return transformation;
  }

  async updateTransformation(id: string, transformationUpdate: Partial<Transformation>): Promise<Transformation | undefined> {
    const existingTransformation = this.transformations.get(id);
    
    if (!existingTransformation) {
      return undefined;
    }
    
    const updatedTransformation: Transformation = {
      ...existingTransformation,
      ...transformationUpdate,
    };
    
    this.transformations.set(id, updatedTransformation);
    return updatedTransformation;
  }

  async deleteTransformation(id: string): Promise<boolean> {
    return this.transformations.delete(id);
  }
}

export const storage = new MemStorage();
