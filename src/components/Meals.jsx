import { useEffect, useState } from "react";
import MealItem from "./MealItem";

export default function Meals() {
    const [loadedMeals, setLoadedMeals] = useState([]);

    useEffect(() => {
        async function fetchMeals() {
            const repsonse = await fetch('http://localhost:3000/meals');

            if (!repsonse.ok) {

            }

            const meals = await repsonse.json();
            setLoadedMeals(meals)
        }

        fetchMeals()
    }, [])

    return <ul id='meals'>
        {
            loadedMeals.map(meal => {
                return <MealItem key={meal.id} meal={meal}/>
            })
        }
    </ul>
}