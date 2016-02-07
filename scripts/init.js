    var camera, scene, renderer;
    var effect, controls;
    var element, container;
    var vrMode = false;

    files = []
    //Get image file list as string
    //Defines 'file_list'
    function getImages(x){
        file = "/files/files.txt"
        $.get(file,function(txt){
            file_list = txt;
        }).done(function(){
            buildArray();
            init(files[x]);
            buttons();
            mobileNext();
        }); 
    }
    //Return each image by taking each new line of 'file_list'
    //Returns images one by one to build array
    function buildArray(){
        var lines = file_list.split("\n");
        for (var i = 0, len = lines.length - 1; i < len; i++) {
                image_src = '/files/' + lines[i];
            files.push(image_src);
        }
    }


    var clock = new THREE.Clock();
    getImages(0);
    index = 0;
    animate();

    function init(files) {

        asset = files;

        renderer = new THREE.WebGLRenderer();
        element = renderer.domElement;
        container = document.getElementById('viewer');
        container.appendChild(element);

        effect = new THREE.StereoEffect(renderer);
        effect.separation = -6.2;
        effect.setSize((window.innerWidth/2), window.innerHeight);

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(90, (window.innerWidth/2) / window.innerHeight, 0.001, 10000);
        camera.position.set(0, 0, 0);
        scene.add(camera);

        controls = new THREE.OrbitControls(camera, element);
//		controls.rotateUp(Math.PI / 4);
		controls.rotateUp(-Math.PI / 12);
        controls.target.set(
			camera.position.x + 0.1,
			camera.position.y,
			camera.position.z
        );
        controls.noZoom = true;
        controls.noPan = true;

		window.addEventListener('deviceorientation', setOrientationControls, true);

		filepath = asset;
         currentSphere = new THREE.Mesh(
                new THREE.SphereGeometry(100, 32, 32),
                new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture(filepath)
                })
        );
        currentSphere.scale.x = -1;
        scene.add(currentSphere);

        window.addEventListener('resize', resize, false);
        setTimeout(resize, 1);
    }

	function setOrientationControls(e) {
	    if (!e.alpha)
	    {
	        return;
	    }

		vrMode = true;
		$('#togglemode-checkbox:checkbox').attr('checked', true);
		

	    controls = new THREE.DeviceOrientationControls(camera, true);
	    controls.connect();
	    controls.update();

		// Full screen requires clicking the icon.
//		element.addEventListener('click', fullscreen, false);

		window.removeEventListener('deviceorientation', setOrientationControls, true);
	}


    function resize() {
        var width = container.offsetWidth;
        var height = container.offsetHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        effect.setSize(width, height);
    }

    function update(dt) {
        resize();

        camera.updateProjectionMatrix();

        controls.update(dt);
    }

	function render(dt)
	{
		if (vrMode == true)
    	{
			effect.render(scene, camera);
		}
		else
		{
			renderer.render(scene, camera);
		}
	}

    function animate(t) {
        requestAnimationFrame(animate);

        update(clock.getDelta());
        render(clock.getDelta());
    }

    function isFullScreen() {
        var fsElem =
                document.fullscreenElement ||
                document.msFullscreenElement ||
                document.mozFullscreenElement ||
                document.webkitFullscreenElement;

        return ((fsElem != null) && (fsElem != undefined));
    }

    function fullscreen() {
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
            container.mozRequestFullScreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        }
    }

function next (){
    if (index < files.length - 1) {
        scene.remove(currentSphere);
        index = index + 1;
         currentSphere = new THREE.Mesh(
                new THREE.SphereGeometry(100, 32, 32),
                new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture(files[index])
                })
        );
        currentSphere.scale.x = -1;
        scene.add(currentSphere);
        if (index != 0) {$('.prev').removeClass('disabled')} else{};
        if (index < files.length - 1) {} else{$('.next').addClass('disabled')};
    } else{};
}

function previous(){
    if (index != 0) {
        $('.next').removeClass('disabled');
        scene.remove(currentSphere);
        index = index - 1;
        currentSphere = new THREE.Mesh(
                new THREE.SphereGeometry(100, 32, 32),
                new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture(files[index])
                })
        );
        currentSphere.scale.x = -1;
        scene.add(currentSphere);
        if (index == 0) {$('.prev').addClass('disabled')} else{};
    } else{};
}

function cycle() {
    if (index == files.length - 1) {cycled = true} else if (index == 0) {cycled = false};
    if (cycled == false) {next()} else {previous()};
}

function exitFullscreen() {
    document.webkitExitFullscreen();
    document.mozCancelFullScreen();
    document.msExitFullscreen();
    document.exitFullscreen();
}

function buttons()
{
    $('#togglemode-checkbox:checkbox').change(function()
    {
        if ($(this).is(':checked'))
        {
            vrMode = true;
        }
        else
        {
            vrMode = false;
        }
    });

    $('#fullscreen-block a.fullscreen').on('click', function()
    {
        
        if (isFullScreen() != true) {
            fullscreen();
            //mobileNext();
        } else{
            exitFullscreen();
        };
    });

    $('#fullscreen-block a.next').on('click', function()
    {
        next();
    });
    $('#fullscreen-block a.prev').on('click', function()
    {
        previous();
    });
};

function desktopFullscreenControls(){
    $('#viewer-toolbar').toggleClass('fsVisible');
    $('a.fullscreen, #togglemode').toggleClass('fsHidden');
}

function mobileNext() {
        $('#viewer').on('click', function(){
            if (isFullScreen() == true) {
                if(WURFL.is_mobile){
                    cycle();
                }
            } else{};    
        });
}
