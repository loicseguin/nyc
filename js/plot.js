"use strict";

function lineChart() {
    var margin = {top: 10, right: 20, bottom: 40, left: 60},
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom,
        xScale = d3.scaleLinear(),
        yScale = d3.scaleLinear(),
        xAxis = d3.axisBottom(xScale).ticks(7),
        yAxis = d3.axisLeft(yScale).ticks(7),
        xGrid = d3.axisBottom(xScale)
                    .tickSize(-height, 0, 0)
                    .tickFormat(""),
        yGrid = d3.axisLeft(yScale)
                    .tickSize(-width, 0, 0)
                    .tickFormat(""),
        colors = d3.schemeCategory10,
        colorindex = -1,
        g = null,
        x_axis_title = "",
        y_axis_title = "",
        zoom = d3.zoom()
            .scaleExtent([0.5, 10])
            .on("zoom", zoomed);

    function plot(selection) {

        selection.each(function(data) {

            // Update the x scale
            // Always make sure that the new data can be fully shown.
            var domain = [
                d3.min([xScale.domain()[0], d3.min(data, function(d) { return d[0]; })]),
                d3.max([xScale.domain()[1], d3.max(data, function(d) { return d[0]; })])
            ];
            xScale
                .domain(domain)
                .range([0, width]);

            // Update the y scale
            // Always make sure that the new data can be fully shown.
            domain = [
                d3.min([yScale.domain()[0], d3.min(data, function(d) { return d[1]; })]),
                d3.max([yScale.domain()[1], d3.max(data, function(d) { return d[1]; })])
            ];
            yScale
                .domain(domain)
                .range([height, 0]);

            // Select the svg element if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);
            var svgEnter;
            if (zoom) {
                svgEnter = svg.enter().append("svg").call(zoom);
            } else {
                svgEnter = svg.enter().append("svg");
            }

            // Otherwise create skeletal graph.
            var gEnter = svgEnter.append("g");
            gEnter.append("g").attr("class", "x grid");
            gEnter.append("g").attr("class", "y grid");
            gEnter.append("g").attr("class", "x axis");
            gEnter.append("g").attr("class", "y axis");
            // For clipping to work, the area to be clipped has to be contained
            // within a "g" element. Add such an element to represent the chart
            // area and then add another one to contain all the lines.
            var idnum = Math.floor(Math.random()*100000)
            gEnter.append("g")
                .attr("class", "chartarea")
                .attr("clip-path", "url(#clip" + idnum + ")")
                .append("g")
                .attr("class", "charts");
            gEnter.append("clipPath")
                .attr("id", "clip" + idnum)
                .append("rect")
                .attr("width", width)
                .attr("height", height);

            // Update outer dimensions, ie, dimensions of the svg element.
            svg = svg.merge(svgEnter);
            svg.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            // Update inner dimensions, ie, dimensions of g element.
            g = svg.select("g")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

            // Update previous lines.
            updateLines();

            // Add the line path.
            var line = d3.line()
                .x(function(d) { return xScale(d[0]); })
                .y(function(d) { return yScale(d[1]); });
            var nlines = svg.selectAll(".line").size();
            var col;
            if (colorindex >= 0) {
                col = colors[colorindex];
            } else {
                col = colors[nlines];
            }

            g.select(".charts")
                .append("path")
                .datum(data)
                .attr("class", "line")
                .attr("id", "line" + nlines)
                .attr("d", line)
                .style("stroke", col);

            // Create grid lines.
            // Animate only if there is already a line so that there is no
            // animation when the page first loads.
            var duration = 0;
            if (nlines > 1) { duration = 1000; }
            g.select(".x.grid")
                .attr("transform", "translate(0," + height + ")")
                .transition()
                .duration(duration)
                .call(xGrid);

            g.select(".y.grid")
                .transition()
                .duration(duration)
                .call(yGrid);

            // Update the x-axis.
            g.select(".x.axis")
                .attr("transform", "translate(0," + yScale.range()[0] + ")")
                .transition()
                .duration(duration)
                .call(xAxis);
            g.select(".x.axis")
                .selectAll(".x.label")
                .data([x_axis_title])
                .enter()
                .append("text")
                .attr("class", "x label")
                .attr("x", width / 2)
                .attr("y", 35)
                .style("text-anchor", "middle")
                .text(function(d) { return d; });

            // Update the y-axis.
            g.select(".y.axis")
                .transition()
                .duration(duration)
                .call(yAxis);
            g.select(".y.axis")
                .selectAll(".y.label")
                .data([y_axis_title])
                .enter()
                .append("text")
                .attr("class", "y label")
                .attr("transform", "rotate(-90)")
                .attr("x", -height/2)
                .attr("y", -55)
                .attr("dy", ".71em")
                .style("text-anchor", "middle")
                .text(function(d) { return d; });

        });
    }

    function updateLines() {
        // Redraw all lines to fit new scale.
        g.selectAll(".line").each(function(d) {
            var line = d3.line()
                .x(function(d) { return xScale(d[0]); })
                .y(function(d) { return yScale(d[1]); });
            d3.select(this)
                .transition()
                .duration(1000)
                .attr("d", line);
        });
    }

    function zoomed() {
        // When a zoom event occurs, zoom the lines and update the scales.
        g.selectAll(".charts")
            .attr("transform", d3.event.transform);
        g.selectAll(".line").style("stroke-width", 2 / d3.event.transform.k);
        g.select(".x.axis")
            .call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
        g.select(".x.grid")
            .call(xGrid.scale(d3.event.transform.rescaleX(xScale)));
        g.select(".y.axis")
            .call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
        g.select(".y.grid")
            .call(yGrid.scale(d3.event.transform.rescaleY(yScale)));
    }

    plot.margins = function(margins) {
        // Get/set margins for plot
        if (!arguments.length) {
            return margin;
        }
        margin = margins;
        return plot;
    };

    plot.dimensions = function(dims) {
        // Get/set width/height for plot
        if (!arguments.length) {
            return [width, height];
        }
        width = dims.width - margin.left - margin.right;
        height = dims.height - margin.top - margin.bottom;

        return plot;
    };

    plot.colori = function(colori) {
        // Get/set color index for plot
        if (!arguments.length) {
            return colorindex;
        }
        colorindex = colori;
        return plot;
    };

    plot.xdomain = function(domain) {
        // Get/set domain for x scale.
        if (!arguments.length) {
            return xScale.domain();
        }
        xScale.domain(domain)
            .range([0, width]);
        // Redraw the lines
        if (g) {
            updateLines();
            // Update the x-axis.
            g.select(".x.axis")
                .call(xAxis);
        }
        return plot;
    };

    plot.ydomain = function(domain) {
        // Get/set domain for y scale.
        if (!arguments.length) {
            return yScale.domain();
        }
        yScale.domain(domain)
            .range([height, 0]);
        // Redraw the lines
        if (g) {
            updateLines();
            // Update the y-axis.
            g.select(".y.axis")
                .call(yAxis);
        }
        return plot;
    };

    plot.update = function(data, lineid) {
        // Change data for a line. This function should only be used if the
        // chart contains a single line.
        if (lineid === undefined) {
            lineid = ".line";
        }
        g.select(lineid)
            .datum(data)
            .attr("d", d3.line()
                .x(function(d) { return xScale(d[0]); })
                .y(function(d) { return yScale(d[1]); }));
    };

    plot.xAxisLabel = function(val) {
        // Get/set label for x axis.
        if (!arguments.length) {
            return x_axis_title;
        }
        x_axis_title = val;
        return plot;
    };

    plot.yAxisLabel = function(val) {
        // Get/set label for y axis.
        if (!arguments.length) {
            return y_axis_title;
        }
        y_axis_title = val;
        return plot;
    };

    plot.toggleZoom = function() {
        if (zoom) {
            zoom = undefined;
        } else {
            zoom = d3.zoom()
                .scaleExtent([0.5, 10])
                .on("zoom", zoomed);
        }
        return plot;
    }

    return plot;
}
