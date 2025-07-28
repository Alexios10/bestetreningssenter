import { useState, useMemo } from "react";
import { Search, LogIn, LogOut, UserRound } from "lucide-react";
import Layout from "../components/Layout";
import TrainingCenterList from "../components/TrainingCenterList";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useTrainingCenters } from "../hooks/useTrainingCenters";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import { useAuthModal } from "@/hooks/useAuthModal";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Home = () => {
  const {
    centers,
    averageRatings,
    userRatings,
    loading,
    showAddForm,
    handleAddCenter,
    handleRateCenter,
    handleDeleteCenter,
    setShowAddForm,
  } = useTrainingCenters();

  const { user, isAuthenticated, logout } = useAuth();
  const { isAuthModalOpen, openAuthModal, closeAuthModal, authSuccess } =
    useAuthModal();

  const [displayCount, setDisplayCount] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [centerFilter, setCenterFilter] = useState<string>("all");
  const [ratingSort, setRatingSort] = useState<"none" | "asc" | "desc">("none");

  // Get unique center titles for filter dropdown - with safety check
  const uniqueCenterTitles = useMemo(() => {
    // Ensure centers is an array before processing
    if (!Array.isArray(centers) || centers.length === 0) {
      return [];
    }

    const titles = new Set<string>();
    centers.forEach((center) => {
      if (center && center.title) {
        // Extract the gym name (first word)
        const gymName = center.title.split(" ")[0];
        titles.add(gymName);
      }
    });
    return Array.from(titles);
  }, [centers]);

  const filteredAndSortedCenters = useMemo(() => {
    // Ensure centers is an array before processing
    if (!Array.isArray(centers)) {
      return [];
    }

    // First filter by search query
    let result = centers.filter((center) => {
      if (!center || !center.title) return false;
      // Match at start of string OR after a space
      return new RegExp(`(^|\\s)${searchQuery.toLowerCase()}`).test(
        center.title.toLowerCase()
      );
    });

    // Then filter by center name
    if (centerFilter && centerFilter !== "all") {
      result = result.filter(
        (center) =>
          center &&
          center.title &&
          center.title.toLowerCase().startsWith(centerFilter.toLowerCase())
      );
    }

    // Then sort by rating if needed
    if (ratingSort !== "none") {
      result = [...result].sort((a, b) => {
        const ratingA = averageRatings[a.id] || 0;
        const ratingB = averageRatings[b.id] || 0;

        return ratingSort === "asc" ? ratingA - ratingB : ratingB - ratingA;
      });
    }

    return result;
  }, [centers, searchQuery, centerFilter, ratingSort, averageRatings]);

  const displayedCenters = filteredAndSortedCenters.slice(0, displayCount);
  const hasMoreToLoad = filteredAndSortedCenters.length > displayCount;

  // Handle loading more centers
  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + 8);
  };

  // Handle center filter and rating sort changes
  const handleCenterFilterChange = (value: string) => {
    setCenterFilter(value);
  };

  // Handle rating sort change
  const handleRatingSortChange = (value: string) => {
    setRatingSort(value as "none" | "asc" | "desc");
  };

  const handleUserButton = () => {
    if (isAuthenticated) {
      // Show dropdown with logout option
    } else {
      openAuthModal();
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <Layout>
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex-1 w-full">
            <Input
              type="text"
              placeholder="Søk etter senter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                X
              </button>
            )}
          </div>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="ml-2 flex items-center gap-2"
                >
                  <UserRound className="h-4 w-4" />
                  <span className="hidden md:inline">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Konto</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logg ut</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              className="ml-2 flex items-center gap-2"
              onClick={() => openAuthModal()}
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden md:inline">Logg inn</span>
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 space-y-1">
            <span className="ml-1 text-sm text-gray-500">Senter</span>
            <Select
              value={centerFilter}
              onValueChange={handleCenterFilterChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by center" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                {uniqueCenterTitles.map((title) => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-1">
            <span className="ml-1 text-sm text-gray-500">Vurdering</span>
            <Select value={ratingSort} onValueChange={handleRatingSortChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Alle</SelectItem>
                <SelectItem value="asc">Lav — høy</SelectItem>
                <SelectItem value="desc">Høy — lav</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* <Button
            disabled
            onClick={() => setShowAddForm(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Legg til Senter
          </Button> */}
        </div>
      </div>

      {/* <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Training Center</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new training center.
            </DialogDescription>
          </DialogHeader>
          <TrainingCenterForm
            onSubmit={handleAddCenter}
            onCancel={() => setShowAddForm(false)}
            hideHeader={true}
          />
        </DialogContent>
      </Dialog> */}

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Treningssentre
        </h2>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="inline-block h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Laster inn sentre...</span>
          </div>
        ) : (
          <>
            {filteredAndSortedCenters.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500">
                  Ingen treningssenter funnet som matcher søket ditt.
                </p>
              </div>
            ) : (
              <>
                <TrainingCenterList
                  centers={displayedCenters}
                  averageRatings={averageRatings}
                  userRatings={userRatings}
                  onRate={handleRateCenter}
                  onDelete={handleDeleteCenter}
                />
                {hasMoreToLoad && (
                  <div className="text-center mt-8">
                    <Button
                      onClick={handleLoadMore}
                      variant="outline"
                      className="inline-flex items-center"
                    >
                      Vis flere
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onSuccess={authSuccess}
        actionMessage="continue"
      />
    </Layout>
  );
};

export default Home;
