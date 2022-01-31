# chess-puzzles backend API

## Routes

- **POST** `/admin/login` *admin authentication with `JWT` system*
- **GET** `/admin/refresh` *admin refresh `JWT` token* **should be logged**
- **GET** `/admin/logout` *revoke `JWT` token*

- **GET** `/puzzle/:id` *get chess puzzle by id*
- **GET** `/puzzles` *get chess puzzles list with pagination*

- **POST** `/admin/puzzle` *create new chess puzzle* **should be logged**
- **PUT** `/admin/puzzle/:id` *update a chess puzzle by id* **should be logged**
- **DELETE** `/admin/puzzle/:id` *delete permanent chess puzzle* **should be logged**

- **GET** `/theme/:id` *get tag puzzle by id*
- **GET** `/themes` *get tag puzzles list with pagination*

- **POST** `/admin/theme` *create new tag puzzle* **should be logged**
- **PUT** `/admin/theme/:id` *update a tag puzzle by id* **should be logged**
- **DELETE** `/admin/theme/:id` *delete permanent tag puzzle* **should be logged**

## Type hint

### Theme (tag puzzle)
```ts
interface Theme {
  /**
   * @var _id uniq id (primary key) generate by MongoDB
   */
  _id: mongoose.Shema.Types.ObjectId,

  /**
   * @var name chess puzzle tag name
   */
  name: mongoose.Schema.Types.String
}
```

### Puzzle (chess puzzle)
```ts
interface Puzzle {
  /**
   * @var themes list of `theme` id use for categorize puzzle 
   */
  themes: [{
    type: mongoose.Schema.Types.ObjectId, ref: "Theme"
  }],

  /**
   * @var position initial chess position with **FEN Notation**
   */
  position: mongoose.Schema.Types.String,

  /**
   * @var difficulty difficulty level quantified as ELO rating system
   */
  difficulty: mongoose.Schema.Types.Number,

  /**
   * @var moves moves contains puzzle solution as full UCI notation "from-to" *(e.g: "e2-e4")*
   */
  moves: [mongoose.Schema.Types.String]
}
```
