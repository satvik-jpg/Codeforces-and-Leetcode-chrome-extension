var visited_color='#28b8d1';


function set_color(problem){
    var key=problem.textContent;
    key=key.trim();
    chrome.storage.sync.get(key,function(result){
        if(result[key]=="visited"){
            problem.style.backgroundColor=visited_color;
        }
    });
}


function togglequestion(problem){
    var key=problem.textContent;
    key=key.trim();
    chrome.storage.sync.get(key,function(result){
        if(result[key]==undefined){
            problem.style.backgroundColor=visited_color;
            chrome.storage.sync.set({[key]:"visited"});
        }
        else{
            problem.style.backgroundColor="white";
            chrome.storage.sync.remove(key);
        }
    });
}

function addToggleButtons(){
        const problems=document.querySelectorAll('.id.left')
        problems.forEach(problem => {
            // togglequestion(problem);
            const toggleButton = document.createElement('button');
            toggleButton.textContent = 'Lock';
            toggleButton.classList.add('toggle-button');
            problem.appendChild(toggleButton);
            set_color(problem);
            toggleButton.addEventListener('click',function(){
                togglequestion(problem)});
        });
    }
    
addToggleButtons();

