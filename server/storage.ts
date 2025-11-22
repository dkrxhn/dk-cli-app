import { type Resume, type InsertResume } from "@shared/schema";

export interface IStorage {
  getResume(): Promise<Resume | undefined>;
  upsertResume(resume: InsertResume): Promise<Resume>;
}

export class MemStorage implements IStorage {
  private resume: Resume | undefined;

  constructor() {
    this.resume = undefined;
  }

  async getResume(): Promise<Resume | undefined> {
    return this.resume;
  }

  async upsertResume(insertResume: InsertResume): Promise<Resume> {
    const resume: Resume = {
      id: this.resume?.id || "default",
      content: insertResume.content,
      updatedAt: new Date(),
    };
    this.resume = resume;
    return resume;
  }
}

export const storage = new MemStorage();
