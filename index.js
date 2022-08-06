document.addEventListener('DOMContentLoaded', () => {

	const grid = document.querySelector('.grid')
	const doodler = document.createElement('div')
	let doodlerLeftSpace = 50
	let startPoint = 150
	let doodlerBottomSpace = startPoint
	let platformCount = 5
	let platforms = []
	let upTimerId
	let downTimerId
	let isJumping = true
	let isGameOver = false
	let isGoingLeft = false
	let isGoingRight = false
	let leftTimerId
	let rightTimerId
	let score = 0
	let resetButton = "<br><button class='btn btn-lg btn-block btn-outline-light' onclick='location.reload()'>Play Again</button>"


	function createDoodler() {
		grid.appendChild(doodler)
		doodler.classList.add('doodler')
		doodlerLeftSpace = platforms[0].left
		doodler.style.left = doodlerLeftSpace + "px"
		doodler.style.bottom = doodlerBottomSpace + "px"
	}

	class Platform {
		constructor(newPlatformBottom){
			this.bottom = newPlatformBottom
			this.left = Math.random() * 315
			this.visual = document.createElement('div')
			const visual = this.visual
			visual.classList.add('platform')
			visual.style.left = this.left + 'px'
			visual.style.bottom = this.bottom + 'px'
			grid.appendChild(visual)
		}
	}

	function createPlatforms(){
		for (let i = 0; i < platformCount; i++) {
			let platformGap = 600 / platformCount
			let newPlatformBottom = 100 + i * platformGap
			let newPlatform = new Platform(newPlatformBottom)
			platforms.push(newPlatform)
		}
	}

	function movePlatforms(){
		if (doodlerBottomSpace > 200){
			platforms.forEach(platform => {
				platform.bottom -= 4
				let visual = platform.visual
				visual.style.bottom = platform.bottom + 'px'

				if(platform.bottom < 10){
					let firstPlatform = platforms[0].visual
					firstPlatform.classList.remove('platform')
					platforms.shift()
					score++ 
					let newPlatform = new Platform(600)
					platforms.push(newPlatform)
				}
			})
		}
	}

	function jump(){
		clearInterval(downTimerId)
		isJumping = true
		upTimerId = setInterval(function(){
			doodlerBottomSpace += 20
			doodler.style.bottom = doodlerBottomSpace + 'px'
			if (doodlerBottomSpace > startPoint + 200){
				fall()
			}
		},30)
	}

	function fall(){
		clearInterval(upTimerId)
		isJumping = false
		downTimerId = setInterval(function(){
			doodlerBottomSpace -= 5
			doodler.style.bottom = doodlerBottomSpace + 'px'
			if (doodlerBottomSpace <= 0){
				gameOver()
			}
			platforms.forEach(platform => {
				if(
					(doodlerBottomSpace >= platform.bottom)
				 && (doodlerBottomSpace <= platform.bottom + 15)
				 && ((doodlerLeftSpace + 60) >= platform.left)
				 && (doodlerLeftSpace <= (platform.left + 85))
				 && !isJumping
				 ){
					startPoint = doodlerBottomSpace
					jump()
				 }
			})
		},20)
	}

	function gameOver (){
		isGameOver = true
		while(grid.firstChild){
			grid.removeChild(grid.firstChild)
		}
		grid.innerHTML = score
		grid.insertAdjacentHTML("beforeend", resetButton)
		clearInterval(upTimerId)
		clearInterval(downTimerId)
		clearInterval(leftTimerId)
		clearInterval(rightTimerId)
	}

	function control(e){
		if (e.key === "ArrowLeft"){
			moveLeft()
		}else if (e.key === "ArrowRight"){
			moveRight()
		}else if (e.key === "ArrowUp"){
			moveStraight()
		}
	}

	function moveLeft(){
		if(isGoingRight){
			clearInterval(rightTimerId)
			isGoingRight = false
		}
		isGoingLeft = true
		clearInterval(leftTimerId)
		leftTimerId = setInterval(function(){
			if(doodlerLeftSpace >= 0){
				doodlerLeftSpace -= 5
				doodler.style.left = doodlerLeftSpace + 'px'
			}else moveRight()
		}, 20) 
	}

	function moveRight(){
		if(isGoingLeft){
			clearInterval(leftTimerId)
			isGoingLeft = false
		}
		isGoingRight = true
		clearInterval(rightTimerId)
		rightTimerId = setInterval(function(){
			if(doodlerLeftSpace <= 340){
				doodlerLeftSpace += 5
				doodler.style.left = doodlerLeftSpace + 'px'
			}else moveLeft()
		}, 20)
	}

	function moveStraight(){
		isGoingLeft = false
		isGoingRight = false
		clearInterval(leftTimerId)
		clearInterval(rightTimerId)
	}

	function start(){
		if (!isGameOver) {
			createPlatforms()
			createDoodler()
			setInterval(movePlatforms, 30)
			jump()
			document.addEventListener('keyup',control)
		}
	}

	start()

})