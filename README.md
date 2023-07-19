### 목차

- 과제가 무엇인가
  - 체크리스트 토글
- 프로젝트 시작방법
  - 프로젝트 시작 전, 서버 실행이 필요합니다. 아래 링크의 레포지토리에서 코드를 clone 한 뒤, 터미널에 명령어를 아래와 같이 입력해주세요.
  - https://github.com/walking-sunset/assignment-api
  ```jsx
  // 1. Install dependencies
  npm install

  // 2. start server
  npm start

  Now server is running on http://localhost:4000/sick
  ```
- 서버 실행이 되고 있다면, 본 레포지토리에서 코드를 clone 한 뒤, 터미널에 명령어를 아래와 같이 입력해주세요.

  ```jsx
  // 1. Install dependencies
  npm install

  // 2. start server
  npm start
  ```

- 데모 영상 (UI)
  - 질환명 검색 → API 호출 통해서 검색어 추천 기능 구현
  - 가장 최근 검색어 → 로컬 스토리지에 저장하여 다음 검색시 추천
  - 메인 UI 이벤트
    - focus : input을 감싸고 있는 테두리 색을 변경하여 focus 상태 사용자에게 알림
    - click : 추천 검색어 & 가장 최근 검색어를 보여줌
    - 검색방법 : 추천 검색어 & 가장 최근 검색어 클릭, 입력 후 엔터 or 입력 후 돋보기 버튼 클릭
- 요구 사항 중 기술 상세
  - API 호출별로 로컬 캐싱 구현 : 캐싱을 어떻게 기술했는지에 대한 내용 README에 기술
  - expire time : 캐싱을 어떻게 기술했는지에 대한 내용 README에 기술
    - 로직 위치 : src > service > index.ts, src > hooks > useGetKeywords.ts
    - 로직 코드
      ```jsx
      import { TKeyword } from '../models';

      const BASE_URL = 'http://localhost:4000/sick';
      const FETCH_DATE = 'Fetch-Date';
      const MAX_AGE = 120_000;

      interface ICacheData {
        get(query: string): Promise<TKeyword[]>;
        fetch: (storage: Cache, query: string) => Promise<TKeyword[]>;
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
          const url = new URL(BASE_URL);
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
      ```
        <aside>
        ⚠️ **변수에 대한 설명**
        
        BASE_URL 로컬에서 서버를 구현하고 있기 때문에, BASE_URL은 은닉하지 않고 파일에 그대로 작성 
        
        FETCH_DATE 변수 사용으로 인해, 오타 줄이기 
        
        MAX_AGE 유효시간은 과제 테스트를 위해 2분으로 짧게 설정
        
        </aside>
        
        <aside>
        ⚠️ **로직에 대한 설명 
        
        -** 캐시에 저장된 해당 키워드에 대한 추천 검색어를 받아오는 함수 get 호출.  만약, 해당 키워드가 없거나, 신선도 검사를 하는 this.isFresh 호출 시 false이면, this.fetch 함수 호출
        
        - fetch 함수를 통해 추천 검색어를 받아오는 api 호출, api호출하여 응답 받은 시간을 넣어주는 함수 this.setExpire 호출하여 만료시간을 넣은 결과물을 캐시에 저장하고 calling console 호출, 응답 결과 리턴
        
        </aside>
        
        <aside>
        ⚠️ **expire에 대한 설명**
         
        - api 호출 시 request header에 max-age를 담아서 호출하였으나 서버에서 받지 않음. 
        - 응답받은 response를  클래스 내의 setExpire 메소드를 통해 새로운 response 객체를 만들고, api호출하여 응답 받은 시간(FETCH_DATA)를 헤더에 넣어서 새 Response 객체를 return
        - 새 Response를 cache에 저장 (fetch 메소드에서) 
        - this.isFresh에 cache를 넣으면 현재 시간 -  저장된 캐시의 FETCH_DATA가 2분보다 적을 경우 true, 많을 경우 false를 리턴하여 캐시 만료 여부 결정
        
        </aside>
        
        <aside>
        ⚠️ **각 메소드에 대한 자세한 설명**
        
        </aside>
        
        <aside>
        ⚠️ **사용 예시
        class를 통해 Cache라는 instance 생성
        get 메소드 사용**
        
        </aside>
        
        ```jsx
        //  useGetKeywords.ts 
        
        const useGetKeywords = () => {
          const getKeywords = useCallback(
            debounce(async (value: string) => {
        
        ...
                const Cache = new CacheData('search');
                const response = await Cache.get(value);
                setKeywords(response.slice(0, 7));
        
              } catch (error) {
                console.log(error);
        
              } finally {
                setIsLoading(false);
              }
            }, 1000),
            [],
          );
        ....
        ```

  - 입력마다 API 호출하지 않도록 API 호출 횟수를 줄이는 전략 수립 및 실행 : README에 전략에 대한 설명 기술
    - 로직 위치 : src > hooks > debounce.ts, useGetKeywords.ts
    - 로직 코드
      ```jsx
      // debounce.ts
      const debounce = (callback: any, delay: number) => {
        let finalExecute: any;

        return function (...args: any) {
          clearTimeout(finalExecute);

          finalExecute = setTimeout(() => {
            callback.apply(callback, args);
          }, delay);
        };
      };

      export default debounce;

      // useGetKeywords.ts
      const useGetKeywords = () => {
      .....
      const getKeywords = useCallback(
          debounce(async (value: string) => {
            setIsLoading(true);

            try {
              if (!value) {
                return;
              }

              const Cache = new CacheData('search');
              const response = await Cache.get(value);
              setKeywords(response.slice(0, 7));
            } catch (error) {
              console.log(error);
            } finally {
              setIsLoading(false);
            }
          }, 1000),
          [],
        );
      .....
      }
      ```
        <aside>
        ⚠️ 입력마다 API 호출하지 않도록 API 호출 횟수를 줄이는 전략
        
        1. debounce 
        연이어 호출되는 함수들 중 마지막 함수(또는 제일 처음)만 호출하도록 하는 기술을 의미합니다. 
        
        실행할 callback함수와 delay 시간을 인자로 받고, 
        delay 시간이 다 되기 전에 debounce를 또 실행했다면, 이전에 최종 실행하기로 했던 새 함수를 바꿉니다. 
        
        callback.apply(callback, args) === callback(args) 
        
        2. debounce 활용
        과제의 경우, 불필요한 api호출을 줄이기 위해 입력 값이 없다면, 
        return을 debounce에 전달하여 함수 호출을 막습니다. 
        1초 안에 다른 함수를 보낸다면, 마지막에 보낸 함수로 교체됩니다.
        
        </aside>

  - 키보드만으로 추천 검색어들로 이동 가능하도록 구현 : README에 전략에 대한 설명 기술
    - 로직 위치 : src > hooks > useHandleKeydown.ts, src > components > searchBar > index.ts
    - 로직 코드
      ```jsx
      // useHandleKeydown.ts

      import { useState } from 'react';

      const useHandleKeydown = () => {
        const [index, setIndex] = useState(-1);

        const changeIndex = (key: string, arrayLength: number) => {
          if (!arrayLength) {
            return;
          }

          if (key === 'ArrowUp') {
            switch (index) {
              case -1:
                setIndex(arrayLength - 1);
                break;

              default:
                setIndex(cur => cur - 1);
                break;
            }
          }

          if (key === 'ArrowDown') {
            switch (index) {
              case arrayLength:
                setIndex(0);
                break;
              default:
                setIndex(cur => cur + 1);
                break;
            }
          }
        };

        return { index, setIndex, changeIndex };
      };

      export default useHandleKeydown;

      // searchBar
      ...
      const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
          const { key } = event;
          if (!label.input || isLoading) return;
          if (key === 'ArrowUp' || key === 'ArrowDown') {
            changeIndex(key, arrayLength);
          }
          return;
        };
      ...

      const changeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
          const { value } = event.currentTarget;
          setLabel({ input: value, keyword: value });
          setIndex(-1);

          setIsLoading(true);
          getKeywords(value);
        };

      .....

      useEffect(() => {
          if (index === -1 || index === arrayLength || !arrayLength) {
            return setLabel({ ...label, keyword: label.input });
          }

          return setLabel({ ...label, keyword: keywords[index]?.sickNm });
        }, [keywords, index]);
      ....

      ```
        <aside>
        ⚠️ **코드 흐름
        
        const [label, setLabel] = useState({ input: '', keyword: '' });**
        
        입력값을 보존한 채로 선택값을 가지기 위해 label.input, label.keyword 값으로 검색어를 관리 
        
        label.keyword는 선택된 값이고, label.input은 입력값이다. 
        ****
        keywords : api호출 결과로 받은 추천 검색어 배열 (최대 7개)
        [위, 아래] 키보드를 누르면, 현재 index를 변경
        input 값의 index === -1, 
        
        나열한 추천 검색어의 index(idx)와 현재 index가 같은 검색어로 input엔 나타남 
        
        useEffect활용하여, keywords와 index가 변할 때마다 표시되는 검색어가 다름. 
        
        입력 시엔 index === -1로 설정하여 선택된 검색어를 입력값으로 변경
        
        </aside>

  - 기타 구현 사항
    - api를 호출 할 때마다 콘솔로그 인포 출력
- 사용 라이브러리
  -

## 원티드 프리온보딩 프론트엔드 인턴십 - 4주차 과제

- **과제 요구 사항**
  - [x] 아래 사이트의 검색영역을 클론하기
  - [x] 질환명 검색시 API 호출 통해서 검색어 추천 기능 구현
    - [x] 검색어가 없을 시 “검색어 없음” 표출
  - [ ] API 호출별로 로컬 캐싱 구현
    - [x] 캐싱 기능을 제공하는 라이브러리 사용 금지(React-Query 등)
    - [ ] 캐싱을 어떻게 기술했는지에 대한 내용 README에 기술
    - [x] expire time을 구현할 경우 가산점
  - [ ] 입력마다 API 호출하지 않도록 API 호출 횟수를 줄이는 전략 수립 및 실행
    - [ ] README에 전략에 대한 설명 기술
  - [ ] API를 호출할 때 마다 `console.info("calling api")` 출력을 통해 콘솔창에서 API 호출 횟수 확인이 가능하도록 설정
  - [ ] 키보드만으로 추천 검색어들로 이동 가능하도록 구현
    - [ ] README에 전략에 대한 설명 기술

## 시작하기

TODO : 서버 설명

```jsx
npm install
npm run start
```

## API 호출별로 로컬 캐싱 구현

TODO : 어떻게, expire time 구현

## API 호출 횟수 감소 전략 수립

TODO : 입력마다 호출하지 않도록 어떻게?

## 키보드 만으로 추천 검색어로 이동

## 사용한 기술
