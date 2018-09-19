import numpy as np
import matplotlib.pyplot as plt

def standing_wave(xs, L, n, A=1.0):
    """Return the y positions of a standing wave on an attached string.

    Parameters
    ----------
    xs : array
        List of values at which to evalute y.
    L : number
        Length of the string.
    n : integer
        Mode number of the standing wave.
    A : number
        Amplitude of the wave.

    """
    wavelength = 2 * L / n
    k = 2 * np.pi / wavelength
    y = A * np.sin(k * xs)
    return y

def despine(ax):
    """Remove all spines from a set of axes."""
    for pos in ax.spines:
        ax.spines[pos].set_visible(False)
    ax.set_xticks([])
    ax.set_yticks([])

def plot_standing(xs, ys, ax):
    """Make a cute plot of a standing wave."""
    ax.plot(xs, ys, 'C0')
    ax.plot(xs, -ys, 'C0', linestyle='--')
    despine(ax)

L = 1.0
xs = np.linspace(0, L, 500)
n_plots = 5
fig, axs = plt.subplots(n_plots, 1, sharex=True, sharey=True,
    tight_layout=True, figsize=(4, 6))
for n in range(n_plots):
    ys = standing_wave(xs, L, n + 1)
    plot_standing(xs, ys, axs[n])

fig.subplots_adjust(hspace=0.6)
plt.show()

