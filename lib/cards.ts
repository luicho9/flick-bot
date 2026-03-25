import { Card, Actions, Button } from "chat";
import type { CardElement } from "chat";
import type { MovieResult } from "./tmdb";

function card(props: Parameters<typeof Card>[0]): CardElement {
  return Card(props) as CardElement;
}

export function welcomeCard() {
  return card({
    title: "What do you want to do?",
    children: [
      Actions([
        Button({ id: "cmd", value: "/trending", label: "🔥 Trending" }),
        Button({ id: "cmd", value: "/best 2025", label: "🏆 Best of 2025" }),
        Button({ id: "cmd", value: "/help", label: "❓ Help" }),
      ]),
    ],
  });
}

export function resultsCard(movies: MovieResult[]) {
  return card({
    title: "Tap for details",
    children: [
      Actions(
        movies.slice(0, 3).map((m) =>
          Button({
            id: "movie",
            value: String(m.id),
            label: m.title.slice(0, 20),
          }),
        ),
      ),
    ],
  });
}

export function detailsCard(movieId: number) {
  return card({
    title: "What next?",
    children: [
      Actions([
        Button({
          id: "cmd",
          value: `/recommend ${movieId}`,
          label: "🎯 Similar",
        }),
        Button({ id: "cmd", value: "/trending", label: "🔥 Trending" }),
        Button({ id: "cmd", value: "/help", label: "❓ Help" }),
      ]),
    ],
  });
}
