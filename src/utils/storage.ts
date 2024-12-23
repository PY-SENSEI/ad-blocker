// Storage utilities for the extension
export class StorageManager {
  static async get(keys: string | string[] | null): Promise<any> {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys, (result) => resolve(result));
    });
  }

  static async set(items: { [key: string]: any }): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set(items, resolve);
    });
  }

  static async getWhitelist(): Promise<string[]> {
    const data = await this.get('whitelist');
    return data.whitelist || [];
  }

  static async addToWhitelist(domain: string): Promise<void> {
    const whitelist = await this.getWhitelist();
    if (!whitelist.includes(domain)) {
      whitelist.push(domain);
      await this.set({ whitelist });
    }
  }

  static async removeFromWhitelist(domain: string): Promise<void> {
    const whitelist = await this.getWhitelist();
    const index = whitelist.indexOf(domain);
    if (index > -1) {
      whitelist.splice(index, 1);
      await this.set({ whitelist });
    }
  }
}