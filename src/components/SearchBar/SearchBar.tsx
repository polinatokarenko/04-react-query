import toast from 'react-hot-toast';
import styles from "./SearchBar.module.css";

type SearchBarProps = {
  onSubmit: (query: string) => void;
};

export default function SearchBar({ onSubmit }: SearchBarProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          className={styles.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>
        <form
          className={styles.form}
          action={(formData: FormData) => {
            const query = formData.get("query") as string;

            if (!query || query.trim() === "") {
              toast.error("Please enter your search query.", {
                style: { fontFamily: "Montserrat" },
              });
              return;
            }

            onSubmit(query);
          }}
        >
          <input
            className={styles.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button className={styles.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}