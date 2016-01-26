    var camera, scene, renderer;
    var effect, controls;
    var element, container;
    var vrMode = false;

    var clock = new THREE.Clock();

    init();
    animate();

    function init() {
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

		var filepath = '/files/sphere.jpg';
        var currentSphere = new THREE.Mesh(
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

	function startProject()
	{
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

$(document).ready(function()
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
        fullscreen();
    });
});