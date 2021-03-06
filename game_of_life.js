var turn_count = 0;
var simulation_started = false;
var width = 15;
var height = 15;
var paused = true;
var interval = 1000;

$(document).ready(function() {
    $('#game-grid').append('<tbody>');

    for (var y = 0; y < height; y++) {
        $('#game-grid').append('<tr class="row">');

        $('#game-grid').append('</tr>');
    }

    $('tr.row').each(function() {
        for (var x = 0; x < width; x++) {
            $(this).append('<td class="cell"/>');
        }
    });

    $('#game-grid').append('</tbody>');

    update_population_count();
    update_turn_count(turn_count);

    $('.cell').bind("click", function() {
        if (!simulation_started) {
            $(this).toggleClass('live-cell');
        }
    })
});

function play() {
    paused = false;
    function timeLoop() {
        setTimeout(function() {
            if (!paused) {
                iteration();
                timeLoop();
            }
        }, interval)
    }
    timeLoop();
}

function pause() {
    paused = true;
}

function speed_up() {
    interval = interval / 2;
}

function slow_down() {
    interval = interval * 2;
}

function iteration() {
    simulation_started = true;
    turn_count++;
    update_turn_count(turn_count);

    var grid = [];

    $("tr.row").each(function() {
        var row = [];
        $(this).children().each(function() {
            if ($(this).hasClass("live-cell")) {
                row.push(true);
            }
            else {
                row.push(false);
            }
        });
        grid.push(row);
    });

    var next_generation = [];

    for (var y = 0; y < grid.length; y++) {
        next_generation_row = [];
        for (var x = 0; x < grid[y].length; x++) {
            var current_cell = [x, y];
            var surrounding_cells = get_surrounding_cells(current_cell, grid);
            next_generation_row.push(get_new_cell_status(current_cell, grid, surrounding_cells));
        }
        next_generation.push(next_generation_row);
    }
    grid = next_generation;

    update_grid(grid);
    update_population_count();
}

function get_new_cell_status(cell, grid, surrounding_cells) {
    // First, get the number of live neighbors
    // var live_neighbors = surrounding_cells.count(true);
    var live_neighbors = 0;

    for (var i = 0; i < surrounding_cells.length; i++) {
        if (surrounding_cells[i]) {
            live_neighbors++;
        }
    }

    if (grid[cell[0]][cell[1]]) {
        // The cell is currently alive, so check if it survived
        if (live_neighbors < 2) {
            // Under-population, leading to death
            return false
        }
        else if ((live_neighbors == 2) || (live_neighbors == 3)) {
            // It lives!
            return true
        }
        else {
            // Over-population, death
            return false
        }
    }
    else {
        // The cell is dead, so we only need to check if there is 3 neighbors
        if (live_neighbors == 3) {
            // 3 neighbors, so reproduction occurs
            return true;
        }
    }
}

function get_surrounding_cells(cell, grid) {
    var surrounding_cells = [];

    var on_left_edge = false;
    var on_right_edge = false;
    var on_top_edge = false;
    var on_bottom_edge = false;

    if (cell[0] == 0) {
        // Cell is on the left edge of the grid
        on_left_edge = true;
    }
    else if (cell[0] == grid[0].length - 1) {
        // Cell is on the right edge of the grid
        on_right_edge = true;
    }
    if (cell[1] == 0) {
        // Cell is on the top edge of the grid
        on_top_edge = true;
    }
    else if (cell[1] == grid.length - 1) {
        // Cell is on the bottom edge of the grid
        on_bottom_edge = true;
    }

    if (!on_left_edge) {
        if (!on_top_edge) {
            surrounding_cells.push(grid[cell[0]-1][cell[1]-1]);
        }
        if (!on_bottom_edge) {
            surrounding_cells.push(grid[cell[0]-1][cell[1]+1]);
        }
        surrounding_cells.push(grid[cell[0]-1][cell[1]]);
    }
    if (!on_right_edge) {
        if (!on_top_edge) {
            surrounding_cells.push(grid[cell[0]+1][cell[1]-1]);
        }
        if (!on_bottom_edge) {
            surrounding_cells.push(grid[cell[0]+1][cell[1]+1]);
        }
        surrounding_cells.push(grid[cell[0]+1][cell[1]]);
    }
    if (!on_top_edge) {
        surrounding_cells.push(grid[cell[0]][cell[1]-1]);
    }
    if (!on_bottom_edge) {
        surrounding_cells.push(grid[cell[0]][cell[1]+1]);
    }

    return surrounding_cells;
}

function update_grid(grid) {
    var html_grid = [];

    $("tr.row").each(function() {
        row = [];

        $(this).children().each(function() {
            row.push(this);
        });

        html_grid.push(row);
    });

    for (var i = 0; i < grid.length; i++) {
        var row_string = '';
        for (var x = 0; x < grid[i].length; x++) {
            if (grid[i][x]) {
                $(html_grid[x][i]).addClass("live-cell");
            }
            else {
                $(html_grid[x][i]).removeClass("live-cell");
            }
        }
    }
}

function update_population_count() {
    var population_count = $('.live-cell').length;
    $('#population-count').html('Population: ' + population_count);
}

function update_turn_count(count) {
    $('#turn-count').html('Turn: ' + count);
}

function grid_clear() {
    paused = true;
    simulation_started = false;
    $('.live-cell').removeClass('live-cell');
    turn_count = 0;
    update_turn_count(turn_count);
    update_population_count();
}

function setup_glider() {
    grid_clear();

    var html_grid = [];

    $("tr.row").each(function() {
        row = [];

        $(this).children().each(function() {
            row.push(this);
        });

        html_grid.push(row);
    });

    $(html_grid[0][1]).addClass("live-cell");
    $(html_grid[1][2]).addClass("live-cell");
    $(html_grid[2][0]).addClass("live-cell");
    $(html_grid[2][1]).addClass("live-cell");
    $(html_grid[2][2]).addClass("live-cell");

    update_population_count();
}

function setup_blinker() {
    grid_clear();

    var html_grid = [];

    $("tr.row").each(function() {
        row = [];

        $(this).children().each(function() {
            row.push(this);
        });

        html_grid.push(row);
    });

    $(html_grid[7][6]).addClass("live-cell");
    $(html_grid[7][7]).addClass("live-cell");
    $(html_grid[7][8]).addClass("live-cell");

    update_population_count();
}

function setup_explosion() {
    grid_clear();

    var html_grid = [];

    $("tr.row").each(function() {
        row = [];

        $(this).children().each(function() {
            row.push(this);
        });

        html_grid.push(row);
    });

    $(html_grid[6][7]).addClass("live-cell");
    $(html_grid[7][6]).addClass("live-cell");
    $(html_grid[7][7]).addClass("live-cell");
    $(html_grid[7][8]).addClass("live-cell");
    $(html_grid[8][7]).addClass("live-cell");

    update_population_count();
}