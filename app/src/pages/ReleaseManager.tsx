import React, { useState, useEffect } from "react";

interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  body: string;
}

const ReleaseManager: React.FC = () => {
  const [currentVersion, setCurrentVersion] = useState<string>("");
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [suggestedVersion, setSuggestedVersion] = useState<string>("");
  const [newVersion, setNewVersion] = useState<string>("");
  const [releaseNotes, setReleaseNotes] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await loadVersionInfo();
      await loadReleases();
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadVersionInfo = async () => {
    try {
      const response = await fetch("/api/version");
      const data = await response.json();
      setCurrentVersion(data.version);
    } catch (error) {
      console.error("Failed to load version info:", error);
    }
  };

  const loadReleases = async () => {
    try {
      const response = await fetch(
        "https://api.github.com/repos/HiVGamesInc/pokemacro/releases"
      );
      const data = await response.json();
      setReleases(data.slice(0, 5)); // Show last 5 releases

      if (data.length > 0) {
        const latestVersion = data[0].tag_name;
        const suggested = suggestNextVersion(latestVersion);
        setSuggestedVersion(suggested);
        setNewVersion(suggested);
      }
    } catch (error) {
      console.error("Failed to load releases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestNextVersion = (lastVersion: string): string => {
    const version = lastVersion.replace(/^v/, "");
    const parts = version.split(".").map(Number);

    // Suggest patch version increment
    parts[2] += 1;
    return parts.join(".");
  };

  const createRelease = async () => {
    if (!newVersion || !releaseNotes) {
      alert("Please fill in version and release notes");
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch("/api/create-release", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: newVersion,
          releaseNotes: releaseNotes,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(
          `Release ${newVersion} created successfully! Check GitHub Actions for build progress.`
        );
        loadReleases();
        setReleaseNotes("");
      } else {
        alert(`Failed to create release: ${result.message}`);
      }
    } catch (error) {
      alert(`Error creating release: ${error}`);
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-900 text-white min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-gray-400">Loading release information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Release Manager</h1>

        {/* Current Status */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-400">Current Version:</span>
              <span className="text-white ml-2 font-mono">
                {currentVersion}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Latest Release:</span>
              <span className="text-green-400 ml-2 font-mono">
                {releases[0]?.tag_name || "None"}
              </span>
            </div>
          </div>
        </div>

        {/* Create New Release */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Release</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Version
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 3.0.1"
                />
                <button
                  onClick={() => setNewVersion(suggestedVersion)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Use Suggested: {suggestedVersion}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Release Notes
              </label>
              <textarea
                value={releaseNotes}
                onChange={(e) => setReleaseNotes(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="## What's New in v3.0.1

### Features
- New feature description

### Bug Fixes
- Fixed issue with...

### Improvements
- Enhanced performance..."
              />
            </div>

            <button
              onClick={createRelease}
              disabled={isCreating || !newVersion || !releaseNotes}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Creating Release...
                </>
              ) : (
                "Create Release"
              )}
            </button>
          </div>
        </div>

        {/* Recent Releases */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Releases</h2>

          {releases.length === 0 ? (
            <p className="text-gray-400">No releases found</p>
          ) : (
            <div className="space-y-4">
              {releases.map((release, index) => (
                <div
                  key={release.tag_name}
                  className="border-l-4 border-blue-500 pl-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">
                      {release.name || release.tag_name}
                    </h3>
                    <span className="text-sm text-gray-400">
                      {formatDate(release.published_at)}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">
                    Version: {release.tag_name}
                  </p>
                  {release.body && (
                    <div className="text-gray-400 text-sm">
                      <pre className="whitespace-pre-wrap font-sans">
                        {release.body.length > 200
                          ? release.body.substring(0, 200) + "..."
                          : release.body}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReleaseManager;
