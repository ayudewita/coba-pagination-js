let currentPage = 1;
const postsContainer = document.querySelector(".posts-container");
let postsPerPage = 6;
const wrapper = document.querySelector(".page-container");

let pageNumbersRange = (numberOfPage, maxVisiblePage, currentPage) => {
  currentPage = currentPage;

  const half = Math.floor(maxVisiblePage / 2);
  let to = maxVisiblePage;

  if (currentPage + half >= numberOfPage) {
    to = numberOfPage;
  } else if (currentPage > half) {
    to = currentPage + half;
  }

  let from = to - maxVisiblePage;

  return Array.from({ length: maxVisiblePage }, (_, i) => i + 1 + from);
};

async function posts(wrapper) {
  try {
    let availablePosts = await getPosts();

    let numberOfPage = Math.ceil(availablePosts.length / postsPerPage);

    DisplayList(availablePosts, postsContainer, currentPage);
    setupPagination(availablePosts, wrapper, numberOfPage);
    prevNextPage(availablePosts, numberOfPage)
  } catch (err) {
    console.log(err);
  }
}

posts(wrapper);

function getPosts() {
  return fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      return response;
    });
}

function DisplayList(
  availablePosts,
  postsContainer,
  currentPage
) {
  postsContainer.innerHTML = "";
  currentPage--;

  let start = postsPerPage * currentPage;
  let end = start + postsPerPage;
  let paginatedItems = availablePosts.slice(start, end);

  for (let i = 0; i < paginatedItems.length; i++) {
    let item = paginatedItems[i];

    let item_element = document.createElement("div");
    item_element.className = "col-md-4 my-3";
    item_element.innerHTML = `<div class="card">
                                <div class="card-body">
                                  <h5 class="card-title">UserId : ${item.userId}</h5>
                                  <h6 class="card-subtitle mb-2 text-muted">Id : ${item.id}</h6>
                                  <p>the title is : ${item.title}</p>
                                  <p>the body is : ${item.body}</p>
                                </div>
                              </div>`;

    postsContainer.appendChild(item_element);
  }
}

function pageLabel(name) {
  let li = document.createElement("li");
  if (typeof name == "string") {
    li.className = "page-item page-link";
  } else {
    li.className = "page-item page-link page";
  }
  li.innerText = name;

  return li;
}

let prev = pageLabel("Prev");
const maxVisiblePage = 5;
let next = pageLabel("Next");

function prevBtnVisibility() {
  if (currentPage == 1) {
    prev.style.visibility = "hidden";
  } else {
    prev.style.visibility = "visible";
  }
}

function nextBtnVisibility(numberOfPage) {
  if (currentPage == numberOfPage) {
    next.style.visibility = "hidden";
  } else {
    next.style.visibility = "visible";
  }
}



function setupPagination(availablePosts, wrapper, numberOfPage) {
  

  prevBtnVisibility();

  wrapper.appendChild(prev);
  
  let range = pageNumbersRange(numberOfPage, maxVisiblePage, currentPage);
  
  for (let i = 0; i < range.length; i++) {
    let btn = paginationButton(range[i], availablePosts);

    wrapper.appendChild(btn);
  }
  
  nextBtnVisibility(numberOfPage)
  wrapper.appendChild(next);

}


function paginationButton(page, availablePosts) {
  let button = pageLabel(page);
  
  if (currentPage == page) button.classList.add("actives");

  button.addEventListener("click", function () {
    currentPage = page;
    
    let current_btn = document.querySelector(".page-container li.actives");
    current_btn.classList.remove("actives");

    button.classList.add("actives");
    
    
    updatePage(currentPage,availablePosts)
  });
 
  
  return button;
  
}

function prevNextPage(availablePosts, numberOfPage){
  prev.addEventListener("click", function () { 
    
    currentPage > 1 ? currentPage-- : currentPage == 1;
     
    updatePage(currentPage,availablePosts)
   
    
  })

  next.addEventListener("click", function () { 
    
    currentPage < numberOfPage ? currentPage++ : currentPage == numberOfPage;     
    
    updatePage(currentPage,availablePosts)
   
    
  })
}


function updatePage(currentPage,availablePosts){
  wrapper.innerHTML = "";
  setupPagination(availablePosts, wrapper);
  DisplayList(availablePosts, postsContainer, currentPage);
  return currentPage
}

