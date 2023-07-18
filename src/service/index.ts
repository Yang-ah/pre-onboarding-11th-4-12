import { Keyword } from '../models';

const BASE_URL = process.env.REACT_APP_API_URL;
const FETCH_DATE = 'Fetch-Date';
const MAX_AGE = 120_000;

interface ICacheData {
  get(query: string): Promise<Keyword[]>;
  fetch: (storage: Cache, query: string) => Promise<Keyword[]>;
  setExpire(response: Response): Promise<Response>;
  isFresh(cache: Response): boolean;
}

export class CacheData implements ICacheData {
  // @ts-ignore
  #storageName: string;

  constructor(storageName: string) {
    this.#storageName = storageName;
  }

  isFresh(cache: Response) {
    const fetchDate = new Date(cache.headers.get(FETCH_DATE)!).getTime();
    const now = new Date().getTime();
    return now - fetchDate < MAX_AGE;
  }

  async get(query: string) {
    const url = new URL('sick', BASE_URL);
    url.searchParams.append('q', query);

    const cacheStorage = await caches.open(this.#storageName);
    const cache = await cacheStorage.match(url);

    return cache && this.isFresh(cache)
      ? cache.json()
      : this.fetch(cacheStorage, url.toString());
  }

  async setExpire(response: Response) {
    const newResponse = response.clone();
    const newBody = await newResponse.blob();
    const newHeaders = new Headers(newResponse.headers);
    newHeaders.append(FETCH_DATE, new Date().toISOString());

    return new Response(newBody, {
      status: newResponse.status,
      statusText: newResponse.statusText,
      headers: newHeaders,
    });
  }

  async fetch(storage: Cache, url: string) {
    try {
      const response = await fetch(url);
      const newResponse = await this.setExpire(response);

      storage.put(url, newResponse);
      console.info('calling api');
      return response.json();
    } catch (error) {
      console.log('fetch error: ', error);
    }
  }
}
