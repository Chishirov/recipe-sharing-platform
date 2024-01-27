import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UpperNav from "../components/UpperNav";
import UserProfile from "../components/UserProfile";
import { UserContext } from "../context/UserContext";
import UserRecipes from "../components/UserRecipes";


 const url = "http://localhost:3000";

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

const User = () => {
  
  // useEffect(() => {
  //   fetchUserData();
  // }, []);


  const {users, setUsers, fetchUserData, url} = useContext(UserContext);

  const [shareMenuVisible, setShareMenuVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);


  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(url);
  //     setUsers(response.data);
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error("Fehler beim Abrufen der Daten:", error.message);
  //   }
  // };

  useEffect(() => {
    fetchUserData();
  }, []);

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

  const saveOrder = async () => {
    try {
      const newRecipeItem = {
        title: nameInput,
        ingredients: produkten,
        steps: steps,
        time: time,
        difficulty: difficulty,
        image: image
      };
      const missingFields = [];

    if (nameInput === "") {
      missingFields.push("Titel");
    }
    if (produkten === "") {
      missingFields.push("Zutaten");
    }
    if (steps === "") {
      missingFields.push("Schritte");
    }
    if (time === "") {
      missingFields.push("Zeit");
    }
    if (difficulty === "") {
      missingFields.push("Schwierigkeitsgrad");
    }

    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(', ');
      alert(`Folgende Felder müssen ausgefüllt werden: ${missingFieldsString}`);
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
      setSelectedRecipeId(null);
      setselectedUserId(null);
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
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(recipeDetails)}`;
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


  return (
    <>
    <UpperNav />
    <UserProfile />
    <UserRecipes />
    </>
  );
};

export default User;



