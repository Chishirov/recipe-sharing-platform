import { createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
	const [users, setUsers] = useState([]);

	const [nameInput, setNameInput] = useState("");
	const [produkten, setProdukten] = useState("");
	const [steps, setSteps] = useState("");
	const [time, setTime] = useState(0);
	const [difficulty, setDifficulty] = useState("");
	const [selectedRecipeId, setSelectedRecipeId] = useState(null);
	const [selectedUserId, setselectedUserId] = useState(null);
	const [image, setImage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isEditingRecipe, setIsEditingRecipe] = useState(false);
	const [isAddingRecipe, setIsAddingRecipe] = useState(false);
	const [isRecipeUpdated, setIsRecipeUpdated] = useState(false);
	const [shareMenuVisible, setShareMenuVisible] = useState(false);
	const [selectedRecipe, setSelectedRecipe] = useState(null);

	const url = "http://localhost:3000";

	const fetchUserData = async () => {
		try {
			const response = await axios.get(url);
			setUsers(response.data);
			console.log(response.data);
		} catch (error) {
			console.error("Fehler beim Abrufen der Daten:", error.message);
		}
		setIsLoading(true);
	};

	const updateRecipe = (orderId, recipeItemId) => {
		const selectedOrder = users.find((o) => o._id === orderId);
		if (selectedOrder) {
			const selectedRecipe = selectedOrder.recipes.find(
				(r) => r._id === recipeItemId
			);

			if (selectedRecipe) {
				setNameInput(selectedRecipe.title);
				setProdukten(selectedRecipe.ingredients);
				setSteps(selectedRecipe.steps);
				setTime(selectedRecipe.time);
				setDifficulty(selectedRecipe.difficulty);
				setImage(selectedRecipe.image);
				setSelectedRecipeId(recipeItemId);
				setselectedUserId(orderId);
				setIsEditingRecipe(true);
			}
		}
	};

	const saveOrder = async (e) => {
		e.preventDefault();
		try {
			const newRecipeItem = {
				title: nameInput,
				ingredients: produkten,
				steps: steps,
				time: time,
				difficulty: difficulty,
				image: image,
			};

			const missingFields = [];
			if (nameInput === "") {
			  missingFields.push("Title");
			}
			if (produkten === "") {
			  missingFields.push("Ingredints");
			}
			if (steps === "") {
			  missingFields.push("Steps");
			}
			if (time === "") {
			  missingFields.push("Time");
			}
			if (difficulty === "") {
			  missingFields.push("Difficulty");
			}
			if (missingFields.length > 0) {
			  const missingFieldsString = missingFields.join(', ');
			  alert(`The following fields must be filled out: ${missingFieldsString}`);
			  return;
			}

			

			if (selectedUserId && selectedRecipeId) {
				const selectedUser = users.find((user) => user._id === selectedUserId);

				if (selectedUser) {
					const selectedRecipeIndex = selectedUser.recipes.findIndex(
						(recipe) => recipe._id === selectedRecipeId
					);

					if (selectedRecipeIndex !== -1) {
						selectedUser.recipes[selectedRecipeIndex] = newRecipeItem;

						await axios.put(
							`${url}/${selectedUserId}/${selectedRecipeId}`,
							newRecipeItem
						);
					}
				}
			} else {
				await axios.post(url, newRecipeItem);
			}

			fetchUserData();

			setNameInput("");
			setProdukten("");
			setSteps("");
			setTime(0);
			setDifficulty("");
			setImage("");
			setSelectedRecipeId(null);
			setselectedUserId(null);
			setIsAddingRecipe(false);
			setIsEditingRecipe(false);
		} catch (error) {
			console.error("Fehler beim Speichern der Bestellung:", error.message);
		}
	};

	const deleteOrder = async (userId, recipeItemId) => {
		try {
			await axios.delete(`${url}/${userId}/${recipeItemId}`);
			fetchUserData();
		} catch (error) {
			console.error("Fehler beim Löschen der Bestellung:", error.message);
		}
	};

	const shareOnFacebook = () => {
		try {
			const recipeDetails = `Name: ${selectedRecipe.title}\nZutaten: ${selectedRecipe.ingredients}\nTime: ${selectedRecipe.time}\nDifficulty: ${selectedRecipe.difficulty}`;
			const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
				window.location.href
			)}&quote=${encodeURIComponent(recipeDetails)}`;
			window.open(shareUrl, "_blank");
		} catch (error) {
			console.error("Error sharing on Facebook:", error);
		}
	};

	const shareOnTwitter = () => {
		try {
			const tweetText = `Name: ${selectedRecipe.title}\nIngredients: ${selectedRecipe.ingredients}\nTime: ${selectedRecipe.time}\nDifficulty: ${selectedRecipe.difficulty}`;
			const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
				tweetText
			)}`;
			window.open(tweetUrl, "_blank");
		} catch (error) {
			console.error("Error sharing on Twitter:", error);
		}
	};

	const toggleShareMenu = (recipe) => {
		setShareMenuVisible(!shareMenuVisible);
		setSelectedRecipe(recipe);
	};

	const ShareMenu = ({ onShareFacebook, onShareTwitter }) => {
		return (
			<div className="share-menu">
				<p>Where would you like to share your recipes?</p>
				<button onClick={onShareFacebook}>Facebook</button>
				<br />

				<button onClick={onShareTwitter}>Twitter</button>
			</div>
		);
	};

	return (
		<UserContext.Provider
			value={{
				users,
				setUsers,
				fetchUserData,
				url,
				updateRecipe,
				saveOrder,
				deleteOrder,
				isLoading,
				setIsLoading,
				isEditingRecipe,
				setIsEditingRecipe,
				isAddingRecipe,
				setIsAddingRecipe,
				nameInput,
				setNameInput,
				produkten,
				setProdukten,
				steps,
				setSteps,
				time,
				setTime,
				difficulty,
				setDifficulty,
				selectedRecipeId,
				setSelectedRecipeId,
				selectedUserId,
				setselectedUserId,
				image,
				setImage,
				isRecipeUpdated,
				setIsRecipeUpdated,
				toggleShareMenu,
				shareOnFacebook,
				shareOnTwitter,
				shareMenuVisible,
				setShareMenuVisible,
				selectedRecipe,
				setSelectedRecipe,
				ShareMenu,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export { UserContext, UserContextProvider };
