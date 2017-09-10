!(function($) {
	function MapOperation() {

	}
	var mapoperation = new MapOperation();
	$.extend({
		mapOperation : mapoperation
	});
	// 展示树结构
	MapOperation.prototype.showMapStructureOnTree = function(data) {
		var treedata = loadCampus(data);
		if (treedata == undefined) {
			return;
		}
		var remoteDateSource = new DataSourceTree({
			data : treedata
		});
		remoteDateSource.multiChoiceTree($("#ale-tree-selectfloor"));
	}

	MapOperation.prototype.showDefaultDefaultMap = function() {
		var defaultMap = [];
		defaultMap["SHYC_B99_F12"] = "中机六院实验基地_外场实验室";
		defaultMap["SHYC_B0_F1"] = "上海烟草浦东园区_鸟瞰";
		requestForMultiMap(defaultMap, $("#ale-tree-selectfloor").data(
				"mapcodes")
				|| []); // 加载新地图
	}
	MapOperation.prototype.saveDefaultMap = function() {
		saveDefaultMapMethod();
	}

	// 初始化隐藏元素
	MapOperation.prototype.hideElement = function() {
		$("#ale-mapviewmode-single").hide();
	}

	// 初始化点击事件
	MapOperation.prototype.bindClickEvent = function() {
		// 单图缩小至多图
		$("#zoomOutMap").click(
				function() {
					$("#ale-mapviewmode-multi svg").each(
							function() {// 全部置成初始值
								var mapzoom = $(this).parents(".widget-box")
										.find(".ale-mapzoom");
								var svg = $(this).parents(".widget-box").find(
										"svg");
								resetSVGZoom(svg, mapzoom);
							});

					zoomInMapUnderTrack($(this));
					$("#ale-mapviewmode-single").hide();
					$("#ale-mapviewmode-multi").show();
					// $("#ale-btn-selectfloor").parent().show();
				});
		// POI显隐
		$("#ale-btn-controlPOI").click(function() {
			var status = $(this).attr("data-ale-status");
			controlPOI(status);
			controlAleStatus($(this), status);
		});
		// 地理围栏显隐
		$("#ale-btn-controlGeofencing").click(function() {
			var status = $(this).attr("data-ale-status");
			controlGeofencing(status);
			controlAleStatus($(this), status);
		});
		// 选择楼层对话框-确认
		$("#ale-dialog-selectfloor .ale-confirm").click(confirmTreeSelect);
		// 单图模式缩小按钮
		$("#ale-mapviewmode-single .ale-mapzoom-btn-out").click(function() {
			operationSvgZoom($(this), true);

		});
		// 单图模式放大按钮
		$("#ale-mapviewmode-single .ale-mapzoom-btn-in").click(function() {
			operationSvgZoom($(this), false);
		});
		// 单图恢复
		$("#ale-mapviewmode-single .ale-mapzoom-btn-recover").click(function() {
			var svg = $("#ale-mapviewmode-single").find("svg");
			var mapzoom = $("#ale-mapviewmode-single .ale-mapzoom");
			resetSVGZoom(svg, mapzoom);
		});
		// 监控模式
		$("#ale-btn-monitoring").click(function() {
			if ($("#ale-monitor-mode").attr("value") != "0") {
				setMonitorModeMethod();
			}
		});
	}
	// 初始化绑定事件
	MapOperation.prototype.bindEvent = function() {
		// 显示框事件->选择楼层按钮->显示框后
		$("#ale-dialog-selectfloor").on("shown.bs.modal", function(e) {
			changeSelectFloorTreeStatus(false, "");
		});
		// treeview事件--第一次加载数据
		$('#ale-tree-selectfloor').on('loaded', onloadTreeEvent);
		// 单图模式平移
		svgPan($("#ale-mapviewmode-single .ale-div-map"), false);

		$('#ale-dialog-selectfloor').on('show.bs.modal', function(event) {
			$.modalJs.adjustBody_beforeShow();
		});
		$('#ale-dialog-selectfloor').on('hidden.bs.modal', function(event) {
			$.modalJs.adjustBody_afterShow();
		});
	}

	MapOperation.prototype.setTrackMode = function() {
		setTrackModeMethod();
	}
	MapOperation.prototype.getTrackTargetMap = function(mac, mapcode) {
		getTrackTargetMapMethod(mac, mapcode);
	}

	MapOperation.prototype.reorderMultiMap = function() {
		reorderMultiMapMethod();
	}

	MapOperation.prototype.removeDeviceFromMap = function(mac) {
		removeDeviceFromMapMethod(mac);

	}

	/* 私有方法 */

	var MULTI_SVGHEIGHT = 400;
	var SINGLE_SVGHEIGHT = window.screen.availHeight - 265;
	var SINGLE_SVGWEIGHT = window.screen.availWidth - 240;

	// //////////////////////////////////////////请求服务/////////////////////////////////////////////
	function requestForMultiMap(keyMap, state, $e) {
		var keys = new Array();
		for ( var p in keyMap) {
			keys.push(p);
		}

		if (keys.length < 1) {
			if ($e != undefined)
				$e.trigger("maploaded");
			return;
		}
		$.post(window.basePath + "/web/v0.2/map/floor", {
			floorCode : keys[0]
		}, function(data) {
			if (data.code == 0) {
				if (data.data.mapcontent == undefined
						|| data.data.mapcontent == "")
					return;

				if (state == "left")// 放置在左侧
					appendMapToMulti($(data.data.mapcontent),
							data.data.mapcode, keyMap, 1);
				else if (state == "right")// 放置在右侧
					appendMapToMulti($(data.data.mapcontent),
							data.data.mapcode, keyMap, 2);
				else {// 均分放置
					var count = $("#ale-multi-left").find(".widget-box").length
							- $("#ale-multi-right").find(".widget-box").length;
					appendMapToMulti($(data.data.mapcontent),
							data.data.mapcode, keyMap, count);
				}
				delete (keyMap[keys[0]]);
				requestForMultiMap(keyMap, state, $e);
			}
		}, "json");
	}

	// 获取单图，同步模式
	function requestForMapSync(floorcode, arrFloorSelect) {
		$.ajax({
			type : "POST",
			url : window.basePath + "/web/v0.2/map/floor",
			async : false,
			dataType : "json",
			success : function(data) {
				if (data.code == 0) {
					if (data.data.mapcontent == undefined
							|| data.data.mapcontent == "")
						return;
					// var count =
					// $("#ale-multi-left").find(".widget-box").length -
					// $("#ale-multi-right").find(".widget-box").length;

					var count = getMultiMapCount();
					appendMapToMulti($(data.data.mapcontent),
							data.data.mapcode, arrFloorSelect, (count + 1));
				}
			}
		});

	}
	// 获得单图,传入floorcode，id-name字典
	function requestForMap(floorcode, arrFloorSelect) {
		$.post(window.basePath + "/web/v0.2/map/floor", {
			floorCode : floorcode
		}, function(data) {
			if (data.code == 0) {
				if (data.data.mapcontent == undefined
						|| data.data.mapcontent == "")
					return;

				var count = getMultiMapCount();
				appendMapToMulti($(data.data.mapcontent), data.data.mapcode,
						arrFloorSelect, (count + 1));
			}
		}, "json");
	}

	// 获得单图,传入floorcode，id-name字典
	function requestForMapShowOnSingleMode(floorcode, arrFloorSelect, $e) {
		$.post(window.basePath + "/web/v0.2/map/floor", {
			floorCode : floorcode
		}, function(data) {
			if (data.code == 0) {
				if (data.data.mapcontent == undefined
						|| data.data.mapcontent == "")
					return;
				var count = getMultiMapCount();
				appendMapToMulti($(data.data.mapcontent), data.data.mapcode,
						arrFloorSelect, (count + 1));
				openSingleMapViewModeByMapCode(floorcode);
				if ($e != undefined)
					$e.trigger("maploaded");
				return;
			}
		}, "json");
	}

	// //////////////////////////////////////////地图操作/////////////////////////////////////////////

	// 保存地图配置
	function saveDefaultMapMethod() {
		var crossfix = function(data, data1) {
			var result = [];
			var common = data.length < data1.length ? data.length
					: data1.length;
			var long_data = data.length > data1.length ? data : data1;
			var max = long_data.length;
			var j = 0;
			for (var i = 0; i < common; i++) {
				result[j++] = data[i];
				result[j++] = data1[i];
			}
			for (var i = common; i < max; i++) {
				result[j++] = long_data[i];
			}
			return result;
		}

		// 用户，监控模式下
		if ($("#ale-user-id").attr("value") == "")
			return;
		if ($("#ale-monitor-mode").attr("value") != "0")
			return;
		var $leftMapCodes = [], $rightMapCodes = [];
		getMultiMapCodes($leftMapCodes, $rightMapCodes);
		var result = crossfix($leftMapCodes, $rightMapCodes);

		$.get(window.basePath + "/web/v0.2/map/config/set", {
			userid : $("#ale-user-id").attr("value"),
			mapcodes : result.join(',')
		}, function(data) {

		}, "json");
	}

	function removeDeviceFromMapMethod(mac) {
		var $device = $("g#Layer_Monitor #g" + mac);
		var devicecount = $device.length;
		var isTrackMode = $("#ale-monitor-mode").attr("value") == 1 ? true
				: false;
		for (var i = 0; i < devicecount; i++) {
			var svgId = $($device[i]).parents("svg").attr("id");
			var $targetcontainer = $($device[i]).parents(".widget-box");
			var mapcode = $targetcontainer.find(
					".widget-header .ale-mapview-title").attr("id");
			d3.select("#" + svgId + " g#MapElement g#Layer_Monitor #g" + mac)
					.remove();
			if (isTrackMode) {
				if ($targetcontainer.find("svg g#MapElement g#Layer_Monitor g").length <= 0) {
					$("#ale-mapviewmode-multi #" + validateDotInId(mapcode))
							.parents(".widget-box").hide();// 隐藏多图模式下的地图
					reorderMultiMapMethod();// 地图重新排列
					if ($targetcontainer.parent().parent().attr("id") == "ale-mapviewmode-single") {
						$("#ale-mapviewmode-single").hide();
						$("#ale-mapviewmode-multi").show();
					}
				}
			}
		}

	}

	function zoomInMapUnderTrack($e) {
		var isTrackMode = $("#ale-monitor-mode").attr("value") == 1 ? true
				: false;
		if (isTrackMode) {
			var $singlecontainer = $e.parents(".widget-box");
			var mapcode = $singlecontainer.find(
					".widget-header .ale-mapview-title").attr("id");
			var $multicontainer = $(
					"#ale-mapviewmode-multi #" + validateDotInId(mapcode))
					.parents(".widget-box");
			var $multiContainerSvgId = $multicontainer.find("svg").attr("id");
			var $multiContainerSvgMonitor = $multicontainer
					.find("svg g#MapElement g#Layer_Monitor");
			$singlecontainer
					.find("svg g#MapElement g#Layer_Monitor g")
					.each(
							function() {
								var mac = $(this).attr("id").substring(1);
								;
								if (d3
										.select(
												"#"
														+ $multiContainerSvgId
														+ " g#MapElement g#Layer_Monitor #g"
														+ mac).empty()) {
									$(this).appendTo($multiContainerSvgMonitor);
									d3
											.select(
													"#"
															+ $multiContainerSvgId
															+ " g#MapElement g#Layer_Monitor #accuracy"
															+ mac)
											.style(
													'fill',
													"url(#"
															+ $multiContainerSvgId
															+ "largeGradient"
															+ ")");
								}
							});
		}
	}

	// /显示追踪目标
	function getTrackTargetMapMethod(mac, mapcode) {
		// 检查原图是否有其他监控目标，若无，则删除该地图；换图时，先判断是单图还是多图模式，并加载相应地图至场景
		// 多图模式：自动删除没有监控目标的楼层；
		// 单图模式:若当前楼层，仍有其他目标，则不删除；若无其他目标则，切图；
		var targetid = "g#MapElement g#Layer_Monitor #g" + mac;
		var showMapUnderMultiMode = function() {
			var mapcodeid = "#" + mapcode.replace(/[.]/g, "\\.");
			if ($("#ale-mapviewmode-multi").find(mapcodeid).length == 0) {
				requestForMap(mapcode, $("#ale-tree-selectfloor").data(
						"mapcodes")); // 加载新地图
			}

			if ($("#ale-mapviewmode-multi").find(mapcodeid).parents(
					".widget-box").css("display") == "none") {
				var $tragetmap = $("#ale-mapviewmode-multi").find(mapcodeid)
						.parents(".widget-box");// 显示已加载过的的地图
				var count = getMultiMapCount();
				if (count >= 1) {
					$tragetmap.appendTo($("#ale-multi-right"));
				} else if (count < 1) {
					$tragetmap.appendTo($("#ale-multi-left"));
				}
				$tragetmap.show();
			}

			var $targets = $("svg " + targetid);// 查找目标
			var count = $targets.length;
			for (var i = 0; i < count; i++) {
				var $targetcontainer = $($targets[i]).parents(".widget-box");
				var comparemapcode = $targetcontainer.find(
						".widget-header .ale-mapview-title").attr("id");
				if (mapcode != comparemapcode) {
					var svgId2 = $targetcontainer.find("svg").attr("id");
					d3.select(
							"#" + svgId2 + " g#MapElement g#Layer_Monitor #g"
									+ mac).remove();// 删除此图中的监控目标
					if ($targetcontainer
							.find("svg g#MapElement g#Layer_Monitor g").length <= 0) {
						// $targetcontainer.hide();//隐藏地图
						$(
								"#ale-mapviewmode-multi #"
										+ validateDotInId(comparemapcode))
								.parents(".widget-box").hide();// 隐藏多图模式下的地图
						reorderMultiMapMethod();// 地图重新排列
					}
				}
			}

		}
		var showMapUnderSingleMode = function() {

			var comparemapcode = $("#ale-mapviewmode-single").find(
					".widget-header .ale-mapview-title").attr("id");
			var svgId = $("#ale-mapviewmode-single").find("svg").attr("id");
			if (mapcode != comparemapcode) {
				d3.select(
						"#" + svgId + " g#MapElement g#Layer_Monitor #g" + mac)
						.remove();
				if ($("#ale-mapviewmode-single").find(
						"svg g#MapElement g#Layer_Monitor g").length <= 0) {
					var $e = $("#" + validateDotInId(mapcode)).parents(
							"#ale-mapviewmode-multi .widget-box");
					if ($e.length == 0) {
						setTimeout(
								function() {
									if ($("#ale-mapviewmode-single").css(
											"display") == "block"
											&& $("#ale-mapviewmode-single")
													.find(
															"svg g#MapElement g#Layer_Monitor g").length <= 0) {
										$("#ale-mapviewmode-single").hide();
										$("#ale-mapviewmode-multi").show();
										$(
												"#ale-mapviewmode-multi #"
														+ validateDotInId(comparemapcode))
												.parents(".widget-box").hide();
									}
								}, 2000);
					} else {
						var floorname = $e.find(
								".widget-header .ale-mapview-title").text();
						var floorid = $e.find(
								".widget-header .ale-mapview-title").attr("id");
						var compass = $e.find(".ale-compass");
						var svg = $e.find("svg");
						openSingleMapViewMode(svg, floorname, floorid, compass);
					}
				}
			}

		}

		showMapUnderMultiMode();
		if ($("#ale-mapviewmode-single").css("display") == "block") {// 单图模式
			showMapUnderSingleMode();
		}
	}

	function getMultiMapCount() {
		var $leftMap = [], $rightMap = [];
		return countMultiMap($leftMap, $rightMap);
	}

	function getMultiMapCodes($leftMapCodes, $rightMapCodes) {

		var $leftMap = [], $rightMap = [];
		countMultiMap($leftMap, $rightMap);
		for (var i = 0; i < $leftMap.length; i++) {
			$leftMapCodes[i] = $($leftMap[i]).find(
					".widget-header .ale-mapview-title").attr("id");
		}
		for (var i = 0; i < $rightMap.length; i++) {
			$rightMapCodes[i] = $($rightMap[i]).find(
					".widget-header .ale-mapview-title").attr("id");
		}
	}

	function countMultiMap($leftMap, $rightMap) {
		var k = 0;
		$("#ale-multi-left").find(".widget-box").each(
				function() {
					var e = $(this);
					if (!e.hasClass("ale-multi-maptemplate")
							&& e.css("display") == "block") {
						$leftMap[k] = e;
						k++;
					}

				});
		k = 0;
		$("#ale-multi-right").find(".widget-box").each(
				function() {
					var e = $(this);
					if (!e.hasClass("ale-multi-maptemplate")) {
						if (!e.hasClass("ale-multi-maptemplate")
								&& e.css("display") == "block") {
							$rightMap[k] = e;
							k++;
						}
					}
				});
		return ($leftMap.length - $rightMap.length);
	}

	function reorderMultiMapMethod() {
		var $leftMap = [], $rightMap = [];
		var count = countMultiMap($leftMap, $rightMap);
		if (count > 1) {
			$($leftMap[$leftMap.length - 1]).appendTo($("#ale-multi-right"));
			reorderMultiMapMethod();
		} else if (count < 0) {
			$($rightMap[$rightMap.length - 1]).appendTo($("#ale-multi-left"));
			reorderMultiMapMethod();
		}
	}

	function resetMapMode() {// 重置地图模式
		$("#ale-mapviewmode-multi").find(".widget-box").each(function() {
			var e = $(this);
			if (!e.hasClass("ale-multi-maptemplate")) {
				e.remove();
			}
		});

		$("#ale-mapviewmode-single").hide();
		$("#ale-mapviewmode-multi").show();
	}
	function setTrackModeMethod() {
		// info primary
		$("#ale-btn-tracking").removeClass("btn-info").addClass("btn-primary");
		if ($("#ale-btn-monitoring").hasClass("btn-primary")) {
			$("#ale-btn-monitoring").removeClass("btn-primary").addClass(
					"btn-info");
		}

		// storeMonitorModeMapView();//存监控模式下的地图
		resetMapMode();

		$("#ale-btn-selectfloor").parent().hide();
		$("#ale-monitor-mode").attr("value", "1");
		$("#ale-title-sub").text("目标追踪");
	}

	function setMonitorModeMethod() {
		$("#ale-btn-monitoring").removeClass("btn-info")
				.addClass("btn-primary");
		if ($("#ale-btn-tracking").hasClass("btn-primary")) {
			$("#ale-btn-tracking").removeClass("btn-primary").addClass(
					"btn-info");
		}

		resetMapMode();
		// parseMonitorModeMapView();//恢复监控模式下的地图

		$("#ale-btn-selectfloor").parent().show();
		$("#ale-monitor-mode").attr("value", "0");
		$("#ale-title-sub").text("全局监控");

	}

	// //////////////////////////////////////////Map至多图模式/////////////////////////////////////////////

	// 删除id中.
	function validateDotInId(id) {
		return id.replace(/[.]/g, "\\.");
	}
	// 替换id中.为dot
	function replaceDotInId(id) {
		return id.replace(/[.]/g, "dot");
	}

	function appendMapToMulti(svgmap, mapcode, mapdictionary, count) {
		var newmap = $("#ale-mapviewmode-multi .ale-multi-maptemplate").clone();
		$(newmap).removeClass("ale-multi-maptemplate");
		// $.mapOperation.bindMultiClickEvent($(newmap));
		bindMultiClickEvent($(newmap));
		// 平移事件
		svgPan(newmap.find(".ale-div-map"), true);

		appendSVGMapToMapContainer(newmap, svgmap, mapcode,
				mapdictionary[mapcode]);
		// 添加SVG至相应widget-box下
		if ($("#ale-mapviewmode-multi #" + validateDotInId(mapcode)).length > 0)// 防止重复添加
			return;

		if (count <= 1) {
			$(newmap).appendTo($("#ale-multi-left"));
		} else {
			$(newmap).appendTo($("#ale-multi-right"));
		}
	}
	// 绑定多图模式下，控件的点击事件
	function bindMultiClickEvent(e) {
		var tool_zoomin = e.find(".zoomInMap");
		bindMulti_ZoomInClick($(tool_zoomin));

		e.on("closed.ace.widget", function(evt, data) {
			saveDefaultMapMethod();
		});

		e.find(".collapseMap").click(
				function() {
					if ($(this).parents(".widget-box").hasClass(
							"ui-sortable-helper")) {
						return; // 防止误操作
					}
					var status = $(this).parents(".widget-box").hasClass(
							"collapsed");
					var mapzoom = $(this).parents(".widget-box").find(
							".ale-mapzoom-multi");
					if (status) {
						setTimeout(function() {
							mapzoom.show();
						}, 150);
					} else {
						mapzoom.hide();
					}
				});

		var zoomBtnGroup = e.find(".ale-mapzoom");
		zoomBtnGroup.data("zoom", 1);
		// 多图模式缩小按钮
		e.find(".ale-mapzoom-btn-out").click(function() {
			operationSvgZoom($(this), true);
		});

		// 多图模式放大按钮
		e.find(".ale-mapzoom-btn-in").click(function() {
			operationSvgZoom($(this), false);
		});
		// 多图模式恢复按钮
		e.find(".ale-mapzoom-btn-recover").click(function() {
			var svg = $(this).parents(".widget-box").find("svg");
			var mapzoom = $(this).parents(".widget-box").find(".ale-mapzoom");
			resetSVGZoom(svg, mapzoom);
		});

	}

	// 添加，并设置svg地图至widget-box
	function appendSVGMapToMapContainer(container, svgmap, mapcode, mapName) {
		// var mapcode = svgmap.attr("id").replace("_Map", "");
		// var mapName = mapdictionary[mapcode];
		var mapDirection = svgmap.attr("northdirection");
		// 设置widget-box id name compass
		$(container).find(".widget-header .ale-mapview-title").attr("id",
				mapcode);
		$(container).find(".widget-header .ale-mapview-title").text(mapName);
		$(container).find(".ale-compass img").css("transform",
				"rotate(" + mapDirection + "deg)");
		// 设置SVG属性
		var svgid = svgmap.attr("id");
		var width = svgmap.attr("width");
		var height = svgmap.attr("height");
		var dwidth = SINGLE_SVGWEIGHT / 2;
		var dheight = MULTI_SVGHEIGHT;
		//
		svgmap.attr("svgDom", computeSVGDisplayScale(width, dwidth,
				height, dheight));
		svgmap.attr("id", "Multi_" + replaceDotInId(mapcode));
		svgmap.attr("width", dwidth);
		svgmap.attr("height", dheight);

		svgmap.find("defs image").each(
				function() {
					var imagepath = $(this).attr("xlink:href");
					var strs = imagepath.split("/");
					var imagename = strs[strs.length - 1].split(".")[0];
					$(this).attr(
							"xlink:href",
							window.basePath + "/data/MapResource/" + imagename
									+ ".svg");
				});

		var geostatus = $("#ale-btn-controlGeofencing").attr("data-ale-status");
		var poistatus = $("#ale-btn-controlPOI").attr("data-ale-status");
		if (geostatus == "false")
			svgmap.find("g#Layer_Geofencing").attr("visibility", "hidden");
		else
			svgmap.find("g#Layer_Geofencing").attr("visibility", "visible");

		if (poistatus == "false")
			svgmap.find("g#POIElement").attr("visibility", "hidden");
		else
			svgmap.find("g#POIElement").attr("visibility", "visible");

		svgmap.appendTo($(container).find(".widget-main .ale-div-map"));
	}
	// 计算缩放比例
	function computeSVGDisplayScale(width, dwidth, height, dheight) {
		var w = parseInt(width) / dwidth;
		w = parseInt((w + 0.05) * 100) / 100.0
		var h = parseInt(height) / dheight;
		h = parseInt((h + 0.05) * 100) / 100.0
		return w > h ? w : h;
	}

	// 绑定多图放大按钮事件
	function bindMulti_ZoomInClick(e) {
		e.click(function() {
			var floor = e.parents(".widget-header").children("h5");
			var floorname = $(floor).text();
			var floorid = $(floor).attr("id");
			var compass = e.parents(".widget-box").find(".ale-compass");
			var svg = e.parents(".widget-box").find("svg");
			var mapzoom = e.parents(".widget-box").find(".ale-mapzoom");
			resetSVGZoom(svg, mapzoom);// 置初始值

			openSingleMapViewMode(svg, floorname, floorid, compass);
		});
	}

	// 通过MapCode打开单图模式

	function openSingleMapViewModeByMapCode(mapcode) {
		var $e = $("#" + validateDotInId(mapcode)).parents(
				"#ale-mapviewmode-multi .widget-box");
		if ($e.length > 0) {
			var floorname = $e.find(".widget-header .ale-mapview-title").text();
			var floorid = $e.find(".widget-header .ale-mapview-title").attr(
					"id");
			var compass = $e.find(".ale-compass");
			var svg = $e.find("svg");
			openSingleMapViewMode(svg, floorname, floorid, compass);
		}
	}

	// 打开单图模式
	function openSingleMapViewMode(e, floorname, floorid, compass) {
		var singlemode = $("#ale-mapviewmode-single").find("h5");
		singlemode.text(floorname);
		singlemode.attr("id", floorid);

		$("#ale-mapviewmode-single .ale-compass").empty();
		$("#ale-mapviewmode-single .ale-compass").html($(compass).html());

		var svg = e.clone();
		$("#ale-mapviewmode-single .ale-div-map").empty();
		// var svg=$(this).parent().parent().parent().find("svg").clone();
		var svgid = svg.attr("id");
		var svgwidth = svg.attr("width");
		var svgheight = svg.attr("height");

		var width = SVG(svgid).viewbox().width; // 可取已加载过的SVG，改变了原有svgid的宽度
		var height = SVG(svgid).viewbox().height;
		var dwidth = SINGLE_SVGWEIGHT;
		var dheight = SINGLE_SVGHEIGHT;

		svg.attr("displayscale", computeSVGDisplayScale(width, dwidth, height,
				dheight));
		svg.attr("width", dwidth);
		svg.attr("height", dheight);
		svg.attr("id", "Single_" + replaceDotInId(floorid)); // 区别SVG id

		svg.appendTo("#ale-mapviewmode-single .ale-div-map");
		$("#ale-mapviewmode-single .ale-mapzoom").data("zoom", 1); // 设置缩放比例
		$("#ale-mapviewmode-multi").hide();
		$("#ale-mapviewmode-single").show();

		e.attr("width", svgwidth);
		e.attr("height", svgheight);
	}
	// //////////////////////////////////////////树操作/////////////////////////////////////////////

	var confirmTreeSelect = function() {
		var datas = $("#ale-tree-selectfloor").find(".tree-item.tree-selected");
		var arrFloorSelect = {}; // 树的选择状态
		for (var i = 0; i < datas.length; i++) {
			if ($(datas[i]).css("display") == "none") {
				continue;
			}
			var floorname = $(datas[i]).find(".tree-item-name").text();
			var buildingname = $(datas[i]).parent().parent().find(
					".tree-folder-header").find(".tree-folder-name").text();
			var mapcode = $(datas[i]).data("mapcode");
			var mapname = buildingname + "_" + floorname;
			arrFloorSelect[mapcode] = mapname;
		}

		var count = 0;
		for ( var key in arrFloorSelect) {
			if (arrFloorSelect.hasOwnProperty(key))
				count++;
		}

		// 先删除ale-mapviewmode-multi中不存在元素，显示唯一元素
		var floors = $("#ale-mapviewmode-multi").find(".widget-box");
		for (var j = 0; j < floors.length; j++) {
			if ($(floors[j]).hasClass("ale-multi-maptemplate"))
				continue;
			var floorid = $(floors[j]).find(".ale-mapview-title").attr("id");
			if (!!!arrFloorSelect[floorid]) { // 如果不包含此key
				$(floors[j]).remove(); // 删除相应图层
			} else {
				delete (arrFloorSelect[floorid]);
				if (count == 1) {
					openSingleMapViewModeByMapCode(floorid);
				}
			}
		}

		if (count == 0) {
			$("#ale-tree-selectfloor").trigger("maploaded");
			$("#ale-mapviewmode-single").hide();
			$("#ale-mapviewmode-multi").show();

		} else if (count == 1) {
			for ( var key in arrFloorSelect) {
				requestForMapShowOnSingleMode(key, arrFloorSelect,
						$("#ale-tree-selectfloor"));
			}
		} else {
			requestForMultiMap(arrFloorSelect, "", $("#ale-tree-selectfloor"));
			$("#ale-mapviewmode-single").hide();
			$("#ale-mapviewmode-multi").show();
		}

		$("#ale-dialog-selectfloor").modal("hide");
	}

	var onloadTreeEvent = function(evt, data) {
		var targetbuilding = data.data.context.textContent.trim(); // 当前点击框名称
		var datas = $("#ale-tree-selectfloor").children(".tree-folder");
		for (var i = 0; i < datas.length; i++) {
			if ($(datas[i]).children(".tree-folder-header").text().trim() == targetbuilding
					&& $(datas[i]).children(".tree-folder-content").text()
							.trim() == "") {
				$(datas[i]).children(".tree-folder-header").trigger("click");
			}
			var datachildren = $(datas[i]).children(".tree-folder-content")
					.children(".tree-folder");
			for (var ii = 0; ii < datachildren.length; ii++) {
				if ($(datachildren[ii]).children(".tree-folder-header").text()
						.trim() == targetbuilding) {
					// 不再执行建筑的点击命令，在园区点击已经执行完毕了
					return;
				}
			}
			for (var j = 0; j < datachildren.length; j++) {
				if ($(datachildren[j]).children(".tree-folder-content").css(
						"display") == "block"
						&& $(datachildren[j]).children(".tree-folder-content")
								.text().trim() == "") {
					$(datachildren[j]).children(".tree-folder-header").trigger(
							"click");
				}
			}
		}
	}

	// 改变树的选择状态
	function changeSelectFloorTreeStatus(bfirst, targetbuilding) {
		var floors = $("#ale-mapviewmode-multi").find(".widget-box");
		var floorArray = [];
		for (var j = 0; j < floors.length; j++) {
			if ($(floors[j]).css("display") == "none") {
				continue;
			}
			floorArray.push($(floors[j]).find(".ale-mapview-title").attr("id"));
		}
		// var floors = $("#ale-mapviewmode-multi").find(".ale-mapview-title");
		var datas = $("#ale-tree-selectfloor").find(".tree-item");
		for (var i = 0; i < datas.length; i++) {
			if ($(datas[i]).css("display") == "none") {
				continue;
			}
			// var floorname = $(datas[i]).find(".tree-item-name").text();
			var buildingname = $(datas[i]).parent().parent().find(
					".tree-folder-header").find(".tree-folder-name").text();
			if (bfirst) {
				if (buildingname != targetbuilding)
					continue;
			}
			var floor = $(datas[i]).data("mapcode");
			var a = $(datas[i]);
			if (isFloorExist(floor, floorArray)) {
				if (!a.hasClass("tree-item tree-selected")) {
					a.trigger("click");
				}
			} else {
				if (a.hasClass("tree-item tree-selected")) {
					a.trigger("click");
				}
			}
		}
	}
	// 检测楼层是否存在
	function isFloorExist(floor, floors) {
		if (floors.indexOf(floor) >= 0)
			return true;
		return false;
	}
	// //////////////////////////////////////////
	// SVG缩放平移////////////////////////////////////////////
	// 操作SVG缩放,in->-0.1,out->0.1;in-fasle,out-true
	function operationSvgZoom(e, status) {
		var svg = e.parents(".widget-body").find("svg");
		var zoom = e.parent().data("zoom");
		var step = status ? 0.1 : (-0.1);
		if (zoom <= 0.1 && status)
			// if ((zoom >= 10 && !status) || (zoom <= 0.1 && status))
			return;
		var scale = svgZoom(svg, zoom, step);
		e.parent().data("zoom", scale);
	}
	// SVG缩放具体方法
	function svgZoom(svg, zoom, step) {
		// 控制
		var scale = parseInt((zoom - step + 0.0001) * 10) / 10.0;
		var translate = svg.find("g#MapElement").attr("transform");

		var width = svg.attr("width"); // viewBox会改变大小width,height大小
		var height = svg.attr("height");

		var svgid = svg.attr("id");

		var vwidth = SVG(svgid).viewbox().width * step / 2;
		var vheight = SVG(svgid).viewbox().height * step / 2;

		var newtranslate = panandZoom(parseInt(vwidth), parseInt(vheight),
				scale, translate);
		svg.find("#Backgroundcolor").attr("transform", newtranslate);
		svg.find("g#MapElement").attr("transform", newtranslate);

		svg.attr("width", width);
		svg.attr("height", height);
		return scale;
	}
	// svg恢复初始状态
	function resetSVGZoom(svg, mapzoom) {
		// var zoom = mapzoom.data("zoom");
		var newtranslate = panandZoom(0, 0, 1, undefined);
		svg.find("#Backgroundcolor").attr("transform", newtranslate);
		svg.find("g#MapElement").attr("transform", newtranslate);
		mapzoom.data("zoom", 1);
	}

	function panandZoom(x, y, scale, translate) {
		if (translate == undefined)
			return "translate(" + x + "," + y + ") scale(" + scale + ")";
		// var old = translate.replace("translate(", "").replace(")",
		// "").replace("scale(", ",").replace(")", "").split(",");
		var old = translate.match(/[-]?\d+(\.\d+)?/g);
		// console.log("OLDMOVE=="+parseInt(old[0])+"---"+parseInt(old[1]));
		var newx = parseInt(x) + parseInt(old[0]);
		var newy = parseInt(y) + parseInt(old[1])
		return "translate(" + newx + "," + newy + ") scale(" + scale + ")";
	}
	// svg平移
	function svgPan(svgContainer, isMulti) {
		svgContainer.mousedown(function(event) {
			if (isMulti) {
				$(this).parents(".widget-container-span").sortable('disable');
			}
			$(this).css("cursor",
					"url(" + window.basePath + "/data/openhand.png), default");

			var svg = $(this).find("svg");
			var startX, startY, movingX, movingY, endX, endY;
			startX = event.pageX;
			startY = event.pageY;

			var zoom = svg.parents(".widget-box").find(".ale-mapzoom").data(
					"zoom");
			var translate = svg.find("g#MapElement").attr("transform");
			var panScale = svg.attr("displayscale");

			$(this).bind("mousemove", function(evt) {
				movingX = evt.pageX;
				movingY = evt.pageY;
				moveX = (movingX - startX) * panScale;
				moveY = (movingY - startY) * panScale;

				moveX = parseInt(moveX);
				moveY = parseInt(moveY);

				var newtranslate = panandZoom(moveX, moveY, zoom, translate);
				svg.find("#Backgroundcolor").attr("transform", newtranslate);
				svg.find("g#MapElement").attr("transform", newtranslate);

			});
		});
		svgContainer.mouseup(function(event) {
			$(this).css("cursor", "default");
			$(this).unbind("mousemove");
			if (isMulti) {
				$(this).parents(".widget-container-span").sortable('enable');
			}
		});
		svgContainer.mouseout(function() {
			$(this).css("cursor", "default");
			$(this).unbind("mousemove");
			if (isMulti) {
				$(this).parents(".widget-container-span").sortable('enable');
			}
		});
	}

	// //////////////////////////////////////////
	// 控制POI，地理围栏状态////////////////////////////////////////////
	// 控制POI状态
	function controlPOI(status) {
		$("svg g#POIElement").each(function() {
			if (status == "true")
				$(this).attr("visibility", "hidden");
			else
				$(this).attr("visibility", "visible");
		});
	}
	// 控制地理围栏状态
	function controlGeofencing(status) {
		$("svg g#Layer_Geofencing").each(function() {
			if (status == "true")
				$(this).attr("visibility", "hidden");
			else
				$(this).attr("visibility", "visible");
		});
	}
	// 控制显示隐藏
	function controlAleStatus(e, status) {
		if (status == "true") {
			e.attr("data-ale-status", "false");
			e.children("span").text("显示");
		} else {
			e.attr("data-ale-status", "true");
			e.children("span").text("隐藏");
		}
	}
	// //////////////////////////////////////////
	// 数据解析////////////////////////////////////////////
	// 树数据源--加载园区结构数据1
	function loadCampus(json_campusdata) {
		if (json_campusdata.code == "1" || json_campusdata == undefined
				|| json_campusdata.data.length < 1)
			return;
		var treedata = {};
		var mapcodes = {};
		for (var i = 0; i < json_campusdata.data.length; i++) {
			var treedata_C = {};
			var json_campus = json_campusdata.data[i];
			joinCampusData(json_campus, treedata_C);
			treedata[i] = treedata_C;
			parseMapCodes(json_campus, mapcodes);
		}
		$("#ale-tree-selectfloor").data("mapcodes", mapcodes);
		$("#ale-tree-selectfloor").trigger("mapstructureloaded", mapcodes);
		return treedata;
	}
	//
	function parseMapCodes(json_campus, mapcodes) {
		if (json_campus == undefined)
			return;
		var json_building = json_campus["buildings"];
		if (json_building == undefined || json_building.length < 1)
			return;
		for (var i = 0; i < json_building.length; i++) {
			var buildingName = json_building[i]["buildingName"];
			;
			var json_floor = json_building[i]["floors"];
			if (json_floor == undefined || json_floor.length < 1)
				continue;
			for (var j = 0; j < json_floor.length; j++) {
				var content = {};
				var mapName = json_floor[j]["mapName"];
				var mapCode = json_floor[j]["mapCode"];
				mapcodes[mapCode] = buildingName + "_" + mapName;
			}
		}
	}

	// 树数据源--加载园区结构数据2
	function joinCampusData(json_campus, treedata_C) {
		if (json_campus == undefined)
			return;
		treedata_C["name"] = json_campus["campusName"];
		treedata_C["type"] = "folder";
		treedata_C["campuscode"] = json_campus["campusCode"];
		var json_building = json_campus["buildings"];
		joinBuildingData(json_building, treedata_C);
	}
	// 树数据源--加载园区结构数据3
	function joinBuildingData(json_building, treedata_C) {
		if (json_building == undefined || json_building.length < 1)
			return;
		var children = {};
		for (var i = 0; i < json_building.length; i++) {
			var content = {};
			content["name"] = json_building[i]["buildingName"];
			content["type"] = "folder";
			content["buildingcode"] = json_building[i]["buildingCode"];
			var json_floor = json_building[i]["floors"];
			var tree_B = {};
			joinFloorData(json_floor, content);
			children[i] = content;
		}
		var additionalParameters = {};
		additionalParameters["children"] = children;
		treedata_C["additionalParameters"] = additionalParameters;
	}
	// 树数据源--加载园区结构数据4
	function joinFloorData(json_floor, tree_B) {
		if (json_floor == undefined || json_floor.length < 1)
			return;
		var children = {};
		for (var i = 0; i < json_floor.length; i++) {
			var content = {};
			content["name"] = json_floor[i]["mapName"];
			content["type"] = "item";
			content["mapcode"] = json_floor[i]["mapCode"];
			children[i] = content;
		}
		var additionalParameters = {};
		additionalParameters["children"] = children;
		tree_B["additionalParameters"] = additionalParameters;
	}
})(jQuery);

// 初始化执行
$(function() {
	$.mapOperation.hideElement();
	$.mapOperation.bindClickEvent();
	$.mapOperation.bindEvent();

	$.mapOperation.showDefaultDefaultMap();
	// $.mapOperation.initData();

});