import fs from 'fs/promises';
import path from 'path';
const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

export type DB = { medias: any[]; users: any[]; };

async function readDb(): Promise<DB> {
  try { const raw = await fs.readFile(DB_PATH, 'utf-8'); return JSON.parse(raw) as DB; }
  catch (err) { const initial: DB = { medias: [], users: [] }; await writeDb(initial); return initial; }
}
async function writeDb(db: DB) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

export const dbService = {
    async getAllMedias() { 
        const db = await readDb(); 
        return db.medias; 
    },
    async getMediaById(id: string) { 
        const db = await readDb(); 
        return db.medias.find(m => m.id === id); 
    },
    async addMedia(media: any) { 
        const db = await readDb(); 
        db.medias.push(media); 
        await writeDb(db); 
        return media; 
    },
    async updateMedia(id: string, patch: any) { 
        const db = await readDb(); 
        const idx = db.medias.findIndex(m => m.id === id); 
        if (idx === -1) return null; 
        db.medias[idx] = { ...db.medias[idx], ...patch }; 
        await writeDb(db); 
        return db.medias[idx]; 
    },
    async deleteMedia(id: string) { 
        const db = await readDb(); 
        const idx = db.medias.findIndex(m => m.id === id); 
        if (idx === -1) return false; 
        db.medias.splice(idx, 1); 
        await writeDb(db); 
        return true; 
    },
    async getUserMedias(userId: string) { 
        const db = await readDb(); 
        return db.medias.filter(m => m.userId === userId); 
    },
    async addUser(user: any) { 
        const db = await readDb(); 
        db.users.push(user); 
        await writeDb(db); 
        return user; 
    },
    async getUsers() { 
        const db = await readDb(); 
        return db.users; 
    },
    async writeRaw(db: DB) { 
        await writeDb(db); 
    }
};

// https://github.com/rafaeldias98/typescript-movies-api