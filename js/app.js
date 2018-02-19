
//IEFE
(function() {
	const modal = document.querySelector('#modal');
	const modalContent = document.querySelector('.modal-content');
	const close = document.querySelector('.close');

	const randomUserAPI = "https://randomuser.me/api/?results=12&nat=us";

	const state = {
	    employee: [],
	    modalOpen: false,
	    modalUserIndex: 0
	};

	function loadURL(randomUserAPI, callback) {
		const xhr = new XMLHttpRequest();
		
		xhr.onreadystatechange = function() {
			if ( this.readyState !== 4 ) {return;}
			if ( this.readyState == 4 && this.status == 200 ) {
				console.log(xhr);
				var jsonResponse = JSON.parse(xhr.response).results;
				callback(jsonResponse);
			} else {
				console.log('The request has failed.');
			}

			console.log('This always will run.');
		};
        xhr.open( 'GET', randomUserAPI );
        xhr.send();
	}

	function makeElement(type) {
		return document.createElement(type);
	}

    function titleCase(str) {
        str = str.toLowerCase();
        str = str.split(" ");
        for (var i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        return str.join(' ');
    }


	function render() {
		if (state.modalOpen) {
		    document.body.style.overflow = 'hidden';
		    var user = state.employee[state.modalUserIndex];
		    var d = user.dob.slice(0, 10).split('-');

		    modalContent.innerHTML =
	        	`<button id="close" class="close">X</button>
    	            <img src=${user.picture.large}>
    	            <h2 class="user-name">${titleCase(user.name.first)} ${titleCase(user.name.last)}</h2>
    	            <p class="email">${user.email}</p>
    	            <p class="location">${titleCase(user.location.city)}</p>

    	            
                    <p class="phone">${user.phone}</p>
    	            <p class="address">${titleCase(user.location.street)}, ${titleCase(user.location.city)}, ${user.location.postcode}, ${user.nat}</p>
    	            <p class="Birthday">Birthday: ${d[1]}/${d[2]}/${d[0]}</p>
                    <div class="modal-buttons">
                    <button id="previous" class="previous">Previous</button>
                    <button id="next" class="next">Next</button>
                    </div>
    	        </div>`
		  
		    modalContent.querySelector('.close').addEventListener('click', function(event) {
		        console.log(event);
                event.preventDefault();
		        state.modalOpen = false;
		        render();
		    });
            modalContent.querySelector('.previous').addEventListener('click', function(event) {
                if (state.modalUserIndex === 0) {
                    state.modalUserIndex = state.employee.length - 1;
                } else {
                    state.modalUserIndex --;
                }
                render();
            });
            modalContent.querySelector('.next').addEventListener('click', function(event) {
                if (state.modalUserIndex === state.employee.length - 1) {
                    state.modalUserIndex = 0;
                } else {
                    state.modalUserIndex ++;
                }
                render();
            });

		    modal.style.display = "block";
		} else {
		    document.body.style.overflow = '';
		    modal.style.display = "none";
		}
	
		const container = document.querySelector('.container');
		container.innerHTML = '';
		state.employee.forEach((user, index) => {
		    let userCard = makeElement("div");
		    userCard.classList = 'user-card';
		    userCard.innerHTML =
        	    `<img src="${user.picture.medium}">
        	       <div class="user-info">
        	        <h2 class="user-name">${titleCase(user.name.first)} ${titleCase(user.name.last)}</h2>
        	        <p class="email">${user.email}</p>
        	        <p class="location">${titleCase(user.location.city)}</p>
        	       </div>
        	   </div>`;
		    userCard.addEventListener('click', event => {
		        state.modalOpen = true;
		        state.modalUserIndex = index;
		        render();
		    });
		    container.appendChild(userCard);
		});
	}

		function init() {
		    loadURL(randomUserAPI, employee => {
		    	console.log(employee);
		        state.employee = employee;
		        render();
		    });
		}

	init();
})();
