"use strict";

const questionsBox = document.querySelectorAll(".questions");
const answerBoxs = document.querySelectorAll(".answer");

questionsBox.forEach((questionsB, index) => {
  questionsB.addEventListener("click", () => {
    if (answerBoxs[index].classList.contains("show")) {
      answerBoxs[index].classList.remove("show");
    } else {
      answerBoxs[index].classList.add("show");
    }
  });
});

const roomsCartSection = document.querySelector(".rooms-cart-section");
(async () => {
  try {
    const res = await fetch("http://localhost:3000/rooms"); 
    const data = await res.json();
    const filteredRooms = data.filter((room) => {
      return parseInt(room.id, 10) <= 4;
    });
    filteredRooms.map((room) => {
      let imageUrl = room.image; 
      if (imageUrl.startsWith('parsa/')) {
        imageUrl = '/' + imageUrl.replace('parsa/', '');
      } else if (!imageUrl.startsWith('/')) {
        imageUrl = '/' + imageUrl;
      }

      roomsCartSection.innerHTML += `
   <div class="room-cart">
  <img src="${imageUrl}" class="room-img" alt="${room.roomName || 'Room Image'}"/> 
  <h2>${room.roomName}</h2>
  <div class="room-information"></div>
  <div class="room-price-and-btn">
    <a href="/parsa/Page/products.html?id=${room.id}" class="room-price-btn">اطلاعات بیشتر</a>
    <p class="room-price">${room.price} تومان</p>
  </div>
</div>

      `;
    });
  } catch (error) {
    console.log(error.message);
  }
})();

const commentsRoot = document.querySelector(".comments-root");
(async () => {
  try {
    const res = await fetch("http://localhost:3000/comments");
    const data = await res.json();
    data.map((comment) => {
      commentsRoot.innerHTML += `
        <div class="comment-box">
          <div >
             <h2 class="username">${comment.username}</h2>
             <p class="like-comment">5/${comment.like}</p>
          </div>
          <p class="comment-description">${comment.description}</p>
        </div>
      `;
    });
  } catch (error) {
    console.log(error.message);
  }
})();



// index.js 

(async () => {
  try {
    const res = await fetch(
      "https:/tapi.bale.ai/bot1520898141:FmyrkuHLM_Zxqdg8Bh-Vb8NaZllBa7oJFkc/update_id:7",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("وضعیت پاسخ:", res.status);

    if (!res.ok) throw new Error("درخواست حذف موفق نبود");

    const data = await res.json(); 
    console.log("پاسخ سرور:", data);
  } catch (error) {
    console.error("خطا:", error.message);
  }
})();
