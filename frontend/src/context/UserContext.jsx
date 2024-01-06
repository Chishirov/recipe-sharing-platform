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

    const url = "http://localhost:3001";

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
            setSelectedRecipeId(recipeItemId);
            setselectedUserId(orderId);
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
            image: image
          };
    
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
          setSelectedRecipeId(null);
          setselectedUserId(null);
          setIsAddingRecipe(false);
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

      


      return (
		<UserContext.Provider
			value={ {
				        users, 
                setUsers,
                fetchUserData,
                url,
                updateRecipe,
                saveOrder,
                deleteOrder,
                isLoading, setIsLoading,
                isEditingRecipe, setIsEditingRecipe,
                isAddingRecipe, setIsAddingRecipe,
                nameInput, setNameInput,
                produkten, setProdukten,
                steps, setSteps,
                time, setTime,
                difficulty, setDifficulty,
                selectedRecipeId, setSelectedRecipeId,
                selectedUserId, setselectedUserId,
                image, setImage





			}}
		>
			{children}
		</UserContext.Provider>
	);  
}

export { UserContext, UserContextProvider };