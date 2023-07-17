const BASE_URL = process.env.REACT_APP_API_URL;

/** TODO : expired 구현 후 삭제
 * getData(): cache & !expired ? cache : fetch();
 * fetch(): api 호출(set expire) & put cache
 */

export class RecommendKeyword {
  private static storageName = 'search';

  static async get(query: string) {
    const url = new URL('sick', BASE_URL);
    url.searchParams.append('q', query);

    const cacheStorage = await caches.open(this.storageName);
    const savedData = await cacheStorage.match(query);

    return savedData
      ? savedData.json()
      : this.fetch(cacheStorage, url.toString(), query);
  }

  static async fetch(storage: Cache, url: string, query: string) {
    const response = await fetch(url);

    storage.put(query, response.clone());
    console.info('calling api');

    return response.json();
  }
}
