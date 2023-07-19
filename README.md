
## 원티드 프리온보딩 프론트엔드 인턴십 - 4주차 과제
[**`wiki`**](https://github.com/Yang-ah/pre-onboarding-11th-4-12/wiki) 에서 README와 동일한 내용을 목차로 보실 수 있습니다 :) 


<details>
<summary> 과제 요구 사항 </summary>
<div markdown="1">
  
  - [x] [사이트](https://clinicaltrialskorea.com/)의 검색영역을 클론하기
  - [x] 질환명 검색시 API 호출 통해서 검색어 추천 기능 구현
    - [x] 검색어가 없을 시 “검색어 없음” 표출
  - [x] API 호출별로 로컬 캐싱 구현
    - [x] 캐싱 기능을 제공하는 라이브러리 사용 금지(React-Query 등)
    - [x] 캐싱을 어떻게 기술했는지에 대한 내용 README에 기술
    - [x] expire time을 구현할 경우 가산점
  - [x] 입력마다 API 호출하지 않도록 API 호출 횟수를 줄이는 전략 수립 및 실행
    - [x] README에 전략에 대한 설명 기술
  - [x] API를 호출할 때 마다 `console.info("calling api")` 출력을 통해 콘솔창에서 API 호출 횟수 확인이 가능하도록 설정
  - [x] 키보드만으로 추천 검색어들로 이동 가능하도록 구현
    - [x] 사용법 README에 기술 

</div>
</details>

<br>
<br>

## 프로젝트 시작방법

### 프로젝트 시작 전
서버 실행이 필요합니다. [링크의 레포지토리](https://github.com/walking-sunset/assignment-api)에서 코드를 clone한 뒤, 터미널에 명령어를 아래와 같이 입력해주세요.

  ```js
  // 1. Install dependencies
  npm install

  // 2. start server
  npm start

  // Now server is running on http://localhost:4000/sick
  ```

### 프로젝트 시작
서버 실행이 되고 있다면, 본 레포지토리에서 코드를 clone 한 뒤, 터미널에 명령어를 아래와 같이 입력해주세요.

  ```js
  npm install

  npm start
  ```

<br>
<br>


## 요구 사항 중 기술 상세


### API 호출별로 로컬 캐싱 구현


- 로직 위치 : src > service > index.ts, 
- 활용 hook : src > hooks > useGetKeywords.ts
- 활용 component : src > components > SearchBar
  

<details>
<summary> 과제 요구 사항 </summary>
<div markdown="1">
  
- [x] 캐싱 기능을 제공하는 라이브러리 사용 금지(React-Query 등)
- [x] API 호출별로 로컬 캐싱 구현 : 캐싱을 어떻게 기술했는지에 대한 내용 README에 기술
- [x] expire time을 구현할 경우 가산점


</div>
</details>



<br>
<br>

> **로컬 캐싱 구현** <br>
> cache를 관리하는 class를 만들어서 로컬 캐싱을 구현했습니다. 



```ts
interface ICacheData {
  get(query: string): Promise<TKeyword[]>;
  fetch: (storage: Cache, query: string) => Promise<TKeyword[]>;
  setExpire(response: Response): Promise<Response>;
  isFresh(cache: Response): boolean;
}
```
- get: 해당 키워드(query)에 대한 추천 검색어를 cache에서 받는 method입니다. 
- fetch: 해당 키워드(query)에 대한 추천 검색어를 받는 api를 호출하고, cache에 추천 검색어들을 저장하는 method입니다.
- setExpire: fetch method에서 받은 response를 cache에 저장하기 전, response의 header에 만료시간(expire) 계산을 위한 응답받은시간(FETCH_DATE)을 넣는 method입니다.  
- isFresh : cache의 신선도 검사를 하는 method입니다.



> **코드 흐름** <br>
> 캐시에 저장된 해당 키워드에 대한 추천 검색어를 받아오는 함수 get 호출. <br>
> 만약, 해당 키워드가 없거나, 신선도 검사를 하는 this.isFresh 호출 시 false이면, this.fetch 함수 호출 <br>
> fetch 함수를 통해 추천 검색어를 받아오는 api 호출 <br>
> api호출하여 응답 받은 시간을 넣어주는 함수 this.setExpire 호출 <br>
> 만료시간을 넣은 결과물을 캐시에 저장하고 calling console 호출 <br>
> 응답 결과 리턴


<br>
<br>


### expire time
api 호출 시 request header에 max-age를 담아서 호출하였으나 서버에서 받지 않고 있기 때문에,<br>
api 호출하여 받은 response에 응답 받은 시간을 headers에 포함하여 cache에 저장하고, <br>
추천 검색어 호출 시 cache에 저장한 시간과 현재 시간 차가 2분으로 설정한 max-age를 넘길 시, <br>
api 호출을 하였습니다. <br>

과제 특성 상, expire 체크를 쉽게 하기 위해 2분으로 짧게 설정하였습니다. <br>

> **코드 흐름** <br>
> 응답받은 response를 클래스 내의 setExpire 메소드를 통해 새로운 response 객체를 만들고, <br>
> api호출하여 응답 받은 시간(FETCH_DATA)를 헤더에 넣어서 새 Response 객체를 return<br>
> 새 Response를 cache에 저장 (fetch 메소드에서)<br>
> this.isFresh에 cache를 넣으면 현재 시간 - 저장된 캐시의 FETCH_DATA가 2분보다 적을 경우 true, 많을 경우 false를 리턴하여 캐시 만료 여부 결정<br>

<br>
<br>

## API 호출 횟수를 줄이는 전략

> 입력마다 API 호출하지 않도록 API 호출 횟수를 줄이는 전략 수립 및 실행


- 로직 위치 : src > hooks > debounce.ts,
- 활용 hook : src > hooks > useGetKeywords.ts

### debounce를 통해 API 호출 감소
입력마다 API를 호출하지 않도록 추천 검색어를 받아오는 함수 호출 시, <br>
delay 시간을 주고, delay 시간(1초) 안에 함수 호출을 하는 경우, <br>
delay 시간 중에 있던 함수를 마지막에 호출한 새 함수로 변경하였습니다. <br>
입력값이 없다면 (지워서 아예 없어지는 경우) return하여 함수 호출을 막았습니다. 

<br>
<br>


## 키보드만으로 추천 검색어들로 이동

> 키보드만으로 추천 검색어들로 이동 가능하도록 구현, 사용법 README에 기술 


- 로직 위치 (hook) : src > hooks > useHandleKeydown.ts
- 활용 component : src > components > searchBar


### 사용법 

검색어 입력창 활성화 된 상태에서 화살표UP 키를 누르면, 검색어가 한 칸 위로 이동합니다. <br>
반대로, 화살표DOWN 키를 누르면, 검색어가 한 칸 아래로 이동합니다. <br>
검색어의 가장 최상단, 최하단에 도달했을 경우 입력값이 선택됩니다. 

### 코드 흐름

```ts
const [label, setLabel] = useState({ input: '', keyword: '' });
```

- 입력값을 보존한 채로 선택값을 가지기 위해 label객체로 검색어를 관리합니다. 
- `label.keyword`는 선택된 값이고, `label.input`은 입력값입니다.
- keywords : api호출 결과로 받은 추천 검색어 배열 (최대 7개) [위, 아래] 키보드를 누르면, 현재 index를 변경 input 값의 index === -1,
- 나열한 추천 검색어의 index(idx)와 현재 index가 같은 검색어로 input엔 나타남
- useEffect 활용하여, keywords와 index가 변할 때마다 표시되는 검색어가 다름.
- 입력 시엔 index === -1로 설정하여 선택된 검색어를 입력값으로 변경


