
//IEFE
(function() {
	const modal = document.querySelector('#modal');
	const modalContent = document.querySelector('.modal-content');
	const close = document.querySelector('.close');
	const path = "https://randomuser.me/api/?results=12&nat=us";

	const searchInput = document.querySelector('.search-input');
	const searchField = document.querySelector('.input');


	const searchSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="20px"><path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"/></svg>'
	const xSVG = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" id="xSVG" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1000 1000" height="20px" enable-background="new 0 0 1000 1000" xml:space="preserve">
<g><path d="M626.9,304L500,430.9L373.1,304L304,373.1L430.9,500L304,626.9l69.1,69.1L500,569.1L626.9,696l69.1-69.1L569.1,500L696,373.1L626.9,304z M500,10C229,10,10,229,10,500s219,490,490,490s490-219,490-490S771,10,500,10z M500,892c-216.1,0-392-175.9-392-392c0-216.1,175.9-392,392-392c216.1,0,392,175.9,392,392C892,716.1,716.1,892,500,892z"/></g>
</svg>`

	searchInput.innerHTML = `<input class="input form-textfield--icon" placeholder="Search employees"/>${searchSVG}${xSVG}`;

	document.querySelector('#xSVG').style.display = 'none';

	let state = {
	    employee: [],
	    filteredEmployee: [],
	    modalWindow: false,
	    modalIndex: 0
	};

	let getData = {
		loadJSON: function(path, callback) {
			const xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if ( this.readyState !== 4 ) {return;}
				if ( this.readyState == 4 && this.status == 200 ) {
					console.log(xhr);
					const jsonResponse = JSON.parse(xhr.response).results;
					callback(jsonResponse);
				} else {
					console.log('The request has failed.');
				}
				console.log('This always will run.');
			};
			xhr.open( 'GET', path );
			xhr.send();
		}
	}

	let render = {
		employeeCards: function() {
		const container = document.querySelector('.container');
		container.innerHTML = '';
		state.filteredEmployee.forEach(function(employee, index) {
		    const userCard = makeElement('div');
		    userCard.classList = 'user-card';
		    userCard.innerHTML =

        	    `<img src="${employee.picture.medium}">
        	       <div class="user-info">
        	        <h2 class="user-name">${titleCase(employee.name.first)} ${titleCase(employee.name.last)}</h2>
        	        <p class="email">${employee.email}</p>
        	        <p class="location">${titleCase(employee.location.city)}</p>
        	       </div>
        	   </div>`;
		    userCard.addEventListener('click', event => {
		    	console.log('emloyee card clicked')
		        state.modalWindow = true;
		        state.modalIndex = index;
		        render.employeeModal();
		    });
		    container.appendChild(userCard);
		  });
		},
		employeeModal: function() {
			let searchField = document.querySelector('.input');
			if (state.modalWindow) {
			    document.body.style.overflow = 'hidden';
			    
			    let employee = state.filteredEmployee[state.modalIndex];
			    let dobDisplay = employee.dob.slice(0, 10).split('-');
			    modalContent.innerHTML =
		        	`<button id="close" class="close">X</button>
	    	            <img src=${employee.picture.large}>
	    	            <h2 class="user-name">${titleCase(employee.name.first)} ${titleCase(employee.name.last)}</h2>
	    	            <p class="user-app-name"><b>${employee.login.username}</b></p>
	    	            <p class="email">${employee.email}</p>
	    	            

	    	            
	                    <p class="phone">${employee.phone}</p>
	    	            <p class="address">${titleCase(employee.location.street)}, ${titleCase(employee.location.city)}, ${employee.location.postcode}, ${employee.nat}</p>
	    	            <p class="Birthday">Birthday: ${dobDisplay[1]}/${dobDisplay[2]}/${dobDisplay[0]}</p>
	                    <div class="modal-buttons">
	                    <button id="previous" class="previous">Previous</button>
	                    <button id="next" class="next">Next</button>
	                    </div>
	    	        </div>`
			    modalContent.querySelector('.close').addEventListener('click', event => {
			        console.log(event);
	                // event.preventDefault();
			        state.modalWindow = false;
			        render.employeeModal();
			    });
			    if (searchField.value == "") {
			    	modalContent.querySelector('.previous').addEventListener('click', event => {
			    	    if (state.modalIndex === 0) {
			    	        state.modalIndex = state.employee.length - 1;
			    	    } else {
			    	        state.modalIndex --;
			    	    }
			    	    render.employeeModal();
			    	});
			    	modalContent.querySelector('.next').addEventListener('click', event => {
			    	    if (state.modalIndex === state.employee.length - 1) {
			    	        state.modalIndex = 0;
			    	    } else {
			    	        state.modalIndex ++;
			    	    }
			    	    render.employeeModal();
			    	});
			    } else {
			    	modalContent.querySelector('.next').style.display = "none";
			    	modalContent.querySelector('.previous').style.display = "none";
			    }
			    modal.style.display = "block";
			} else {
			    document.body.style.overflow = '';
			    modal.style.display = "none";
			}
		}
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
	
	function init() {
	    getData.loadJSON(path, employee => {
	    	console.log(employee);
	        state.employee = employee;
	        state.filteredEmployee = employee;
	        render.employeeCards();
	    });

	    searchInput.addEventListener('keyup', function(event) {
	        let searchTarget = event.target.value.toLowerCase();
	        if (searchTarget === "") {
	            state.filteredEmployee = state.employee;
	            document.querySelector('#xSVG').style.display = 'none';
	        } else {
	        	document.querySelector('#xSVG').style.display = 'block';
	            state.filteredEmployee = state.employee.filter(employee => {
	                return employee.name.first.toLowerCase().indexOf(searchTarget) > -1 ||
	                employee.name.last.toLowerCase().indexOf(searchTarget) > -1 ||
	                employee.login.username.toLowerCase().indexOf(searchTarget) > -1;
	            }).map(function (employee, index) {
	                employee.filteredId = index;
	                return employee;
	            });
	            document.querySelector('#xSVG').addEventListener('click', function() {
	                	event.target.value = "";
	                	state.filteredEmployee = state.employee;
	                	document.querySelector('#xSVG').style.display = 'none';
	                	render.employeeCards();
	                });
	        }
	        render.employeeCards();
	        render.employeeModal();
	    });
	}
	init();
})();
